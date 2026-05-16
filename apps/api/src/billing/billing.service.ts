import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BillStatus, BillType, TenantStatus, UserRole } from '@bhaus/types';
import { PrismaService } from '../prisma/prisma.service';
import { GenerateBillsDto } from './dto/generate-bills.dto';

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('BILLING_QUEUE') private readonly billingQueue: Queue,
    @Inject('NOTIFICATIONS_QUEUE') private readonly notificationsQueue: Queue,
  ) {}

  private async landlordHouseId(userId: string): Promise<string> {
    const house = await this.prisma.house.findUnique({ where: { landlordId: userId } });
    if (!house) throw new NotFoundException('House not found');
    return house.id;
  }

  async generateBills(userId: string, role: string, dto: GenerateBillsDto) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can generate bills');
    const houseId = await this.landlordHouseId(userId);
    const house = await this.prisma.house.findUnique({ where: { id: houseId }, include: { settings: true } });
    if (!house?.settings) throw new NotFoundException('House settings not found');

    const { billingMonth, billingYear, electricityAmount, waterAmount } = dto;
    const settings = house.settings;

    const dueDate = new Date(billingYear, billingMonth - 1, settings.rentDueDay);

    const tenants = await this.prisma.tenantProfile.findMany({
      where: { houseId, status: TenantStatus.APPROVED },
    });

    const createdBills = [];

    for (const tenant of tenants) {
      const existingRent = await this.prisma.bill.findFirst({
        where: { tenantId: tenant.id, billingMonth, billingYear, type: BillType.RENT },
      });

      if (existingRent) continue;

      const rentBill = await this.prisma.bill.create({
        data: {
          tenantId: tenant.id,
          houseId,
          type: BillType.RENT,
          amount: settings.rentAmount,
          dueDate,
          billingMonth,
          billingYear,
        },
      });
      createdBills.push(rentBill);

      if (settings.electricityEnabled && electricityAmount != null) {
        const electricBill = await this.prisma.bill.create({
          data: {
            tenantId: tenant.id,
            houseId,
            type: BillType.ELECTRIC,
            amount: electricityAmount,
            dueDate,
            billingMonth,
            billingYear,
          },
        });
        createdBills.push(electricBill);
      }

      if (settings.waterEnabled && waterAmount != null) {
        const waterBill = await this.prisma.bill.create({
          data: {
            tenantId: tenant.id,
            houseId,
            type: BillType.WATER,
            amount: waterAmount,
            dueDate,
            billingMonth,
            billingYear,
          },
        });
        createdBills.push(waterBill);
      }

      const appliances = await this.prisma.appliance.findMany({
        where: { tenantId: tenant.id, status: 'APPROVED', billingType: 'MONTHLY' },
      });

      for (const appliance of appliances) {
        const existingAppliance = await this.prisma.bill.findFirst({
          where: { tenantId: tenant.id, billingMonth, billingYear, type: BillType.APPLIANCE, applianceId: appliance.id },
        });
        if (!existingAppliance) {
          const applianceBill = await this.prisma.bill.create({
            data: {
              tenantId: tenant.id,
              houseId,
              type: BillType.APPLIANCE,
              amount: appliance.registrationFee,
              dueDate,
              billingMonth,
              billingYear,
              applianceId: appliance.id,
            },
          });
          createdBills.push(applianceBill);
        }
      }
    }

    return { generated: createdBills.length, bills: createdBills };
  }

  async listBills(userId: string, role: string, filters: { tenantId?: string; status?: string; billingMonth?: number; billingYear?: number; type?: string }) {
    const houseId = await this.landlordHouseId(userId);
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can list all bills');

    const where: Record<string, unknown> = { houseId };
    if (filters.tenantId) where['tenantId'] = filters.tenantId;
    if (filters.status) where['status'] = filters.status;
    if (filters.billingMonth) where['billingMonth'] = filters.billingMonth;
    if (filters.billingYear) where['billingYear'] = filters.billingYear;
    if (filters.type) where['type'] = filters.type;

    return this.prisma.bill.findMany({ where, include: { tenant: { include: { user: true } }, payments: true }, orderBy: { createdAt: 'desc' } });
  }

  async listMyBills(userId: string, filters: { status?: string; billingMonth?: number; billingYear?: number }) {
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');

    const where: Record<string, unknown> = { tenantId: tenant.id };
    if (filters.status) where['status'] = filters.status;
    if (filters.billingMonth) where['billingMonth'] = filters.billingMonth;
    if (filters.billingYear) where['billingYear'] = filters.billingYear;

    return this.prisma.bill.findMany({ where, include: { payments: true }, orderBy: { createdAt: 'desc' } });
  }

  async getBill(id: string, userId: string, role: string) {
    const bill = await this.prisma.bill.findUnique({ where: { id }, include: { tenant: { include: { user: true } }, payments: true } });
    if (!bill) throw new NotFoundException('Bill not found');

    if (role === UserRole.LANDLORD) {
      const houseId = await this.landlordHouseId(userId);
      if (bill.houseId !== houseId) throw new ForbiddenException('Bill does not belong to your house');
    } else {
      const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
      if (!tenant || bill.tenantId !== tenant.id) throw new ForbiddenException('Access denied');
    }

    return bill;
  }

  async markOverdue(id: string, userId: string, role: string) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can mark bills as overdue');
    const houseId = await this.landlordHouseId(userId);
    const bill = await this.prisma.bill.findUnique({ where: { id } });
    if (!bill || bill.houseId !== houseId) throw new NotFoundException('Bill not found');

    return this.prisma.bill.update({ where: { id }, data: { status: BillStatus.OVERDUE } });
  }

  async deleteBill(id: string, userId: string, role: string) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can delete bills');
    const houseId = await this.landlordHouseId(userId);
    const bill = await this.prisma.bill.findUnique({ where: { id } });
    if (!bill || bill.houseId !== houseId) throw new NotFoundException('Bill not found');
    if (bill.status !== BillStatus.UNPAID) throw new ForbiddenException('Only UNPAID bills can be deleted');

    return this.prisma.bill.delete({ where: { id } });
  }

  async getSummary(userId: string, role: string, billingMonth: number, billingYear: number) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can view summary');
    const houseId = await this.landlordHouseId(userId);

    const bills = await this.prisma.bill.findMany({
      where: { houseId, billingMonth, billingYear },
      include: { tenant: { include: { user: true } } },
    });

    const totalBilled = bills.reduce((sum, b) => sum + Number(b.amount), 0);
    const totalPaid = bills.filter(b => b.status === BillStatus.PAID).reduce((sum, b) => sum + Number(b.amount), 0);
    const totalOverdue = bills.filter(b => b.status === BillStatus.OVERDUE).reduce((sum, b) => sum + Number(b.amount), 0);

    const tenantMap = new Map<string, { tenantId: string; tenantName: string; totalBilled: number; totalPaid: number }>();
    for (const bill of bills) {
      const key = bill.tenantId;
      if (!tenantMap.has(key)) {
        tenantMap.set(key, { tenantId: key, tenantName: bill.tenant.user.fullName, totalBilled: 0, totalPaid: 0 });
      }
      const entry = tenantMap.get(key)!;
      entry.totalBilled += Number(bill.amount);
      if (bill.status === BillStatus.PAID) entry.totalPaid += Number(bill.amount);
    }

    return { totalBilled, totalPaid, totalOverdue, tenants: Array.from(tenantMap.values()) };
  }

  async getMySummary(userId: string) {
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');

    const bills = await this.prisma.bill.findMany({ where: { tenantId: tenant.id } });
    const totalOutstanding = bills
      .filter(b => b.status === BillStatus.UNPAID || b.status === BillStatus.OVERDUE)
      .reduce((sum, b) => sum + Number(b.amount), 0);
    const totalPaid = bills.filter(b => b.status === BillStatus.PAID).reduce((sum, b) => sum + Number(b.amount), 0);
    const nextDue = bills
      .filter(b => b.status === BillStatus.UNPAID)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] ?? null;

    return { totalOutstanding, totalPaid, nextDue };
  }

  async runAutoOverdue() {
    const now = new Date();
    const overdueBills = await this.prisma.bill.findMany({
      where: { status: BillStatus.UNPAID, dueDate: { lt: now } },
      include: { tenant: { include: { user: true } } },
    });

    for (const bill of overdueBills) {
      await this.prisma.bill.update({ where: { id: bill.id }, data: { status: BillStatus.OVERDUE } });
      try {
        await this.notificationsQueue.add('auto-overdue', {
          tenantId: bill.tenant.userId,
          billId: bill.id,
          amount: bill.amount.toString(),
        });
      } catch (_err) {
        // non-blocking
      }
    }

    return { processed: overdueBills.length };
  }

  async runBillReminder() {
    const now = new Date();
    const bills = await this.prisma.bill.findMany({
      where: { status: BillStatus.UNPAID },
      include: { tenant: { include: { user: true, house: { include: { settings: true } } } } },
    });

    let reminded = 0;
    for (const bill of bills) {
      const settings = bill.tenant.house?.settings;
      if (!settings) continue;
      const notifyDaysBefore = settings.notifyDaysBefore;
      const dueDate = new Date(bill.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= notifyDaysBefore && daysUntilDue >= 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bill.lastReminderSentAt && new Date(bill.lastReminderSentAt) >= today) continue;

        await this.prisma.bill.update({ where: { id: bill.id }, data: { lastReminderSentAt: now } });
        try {
          await this.notificationsQueue.add('bill-reminder', {
            tenantId: bill.tenant.userId,
            billId: bill.id,
            amount: bill.amount.toString(),
            dueDate: dueDate.toLocaleDateString(),
          });
        } catch (_err) {
          // non-blocking
        }
        reminded++;
      }
    }

    return { reminded };
  }
}
