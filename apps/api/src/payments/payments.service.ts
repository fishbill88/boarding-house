import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { BillStatus, PaymentStatus, UserRole } from '@bhaus/types';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitPaymentDto } from './dto/submit-payment.dto';
import { RejectPaymentDto } from './dto/reject-payment.dto';
import { LandlordRecordDto } from './dto/landlord-record.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATIONS_QUEUE') private readonly notificationsQueue: Queue,
  ) {}

  private async landlordHouseId(userId: string): Promise<string> {
    const house = await this.prisma.house.findUnique({ where: { landlordId: userId } });
    if (!house) throw new NotFoundException('House not found');
    return house.id;
  }

  async submitPayment(userId: string, dto: SubmitPaymentDto) {
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId }, include: { user: true } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');

    const bill = await this.prisma.bill.findUnique({ where: { id: dto.billId } });
    if (!bill) throw new NotFoundException('Bill not found');
    if (bill.tenantId !== tenant.id) throw new ForbiddenException('Bill does not belong to you');
    if (bill.status !== BillStatus.UNPAID && bill.status !== BillStatus.OVERDUE) {
      throw new ForbiddenException('Bill is not in a payable state');
    }

    const payment = await this.prisma.payment.create({
      data: {
        billId: dto.billId,
        tenantId: tenant.id,
        amount: dto.amount,
        proofImageUrl: dto.proofImageUrl,
        status: PaymentStatus.PENDING,
      },
    });

    await this.prisma.bill.update({ where: { id: dto.billId }, data: { status: BillStatus.PENDING_APPROVAL } });

    try {
      const house = await this.prisma.house.findUnique({ where: { id: bill.houseId } });
      if (house) {
        await this.notificationsQueue.add('payment-submitted', {
          landlordId: house.landlordId,
          tenantName: tenant.user.fullName,
          billId: dto.billId,
          paymentId: payment.id,
        });
      }
    } catch (_err) { /* fire-and-forget */ }

    return payment;
  }

  async listPayments(userId: string, role: string, filters: { status?: string; tenantId?: string; billId?: string }) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can list all payments');
    const houseId = await this.landlordHouseId(userId);

    const bills = await this.prisma.bill.findMany({ where: { houseId }, select: { id: true } });
    const billIds = bills.map(b => b.id);

    const where: Record<string, unknown> = { billId: { in: billIds } };
    if (filters.status) where['status'] = filters.status;
    if (filters.tenantId) {
      const tenantProfile = await this.prisma.tenantProfile.findFirst({ where: { id: filters.tenantId, houseId } });
      if (tenantProfile) where['tenantId'] = tenantProfile.id;
    }
    if (filters.billId) where['billId'] = filters.billId;

    return this.prisma.payment.findMany({ where, include: { bill: true }, orderBy: { submittedAt: 'desc' } });
  }

  async listMyPayments(userId: string) {
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');
    return this.prisma.payment.findMany({ where: { tenantId: tenant.id }, include: { bill: true }, orderBy: { submittedAt: 'desc' } });
  }

  async getPayment(id: string, userId: string, role: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: { bill: true } });
    if (!payment) throw new NotFoundException('Payment not found');

    if (role === UserRole.LANDLORD) {
      const houseId = await this.landlordHouseId(userId);
      if (payment.bill.houseId !== houseId) throw new ForbiddenException('Access denied');
    } else {
      const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
      if (!tenant || payment.tenantId !== tenant.id) throw new ForbiddenException('Access denied');
    }

    return payment;
  }

  async approvePayment(id: string, userId: string, role: string) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can approve payments');
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: { bill: true } });
    if (!payment) throw new NotFoundException('Payment not found');

    const houseId = await this.landlordHouseId(userId);
    if (payment.bill.houseId !== houseId) throw new ForbiddenException('Access denied');

    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.APPROVED, reviewedAt: new Date() },
    });
    await this.prisma.bill.update({ where: { id: payment.billId }, data: { status: BillStatus.PAID } });

    try {
      const tenantProfile = await this.prisma.tenantProfile.findUnique({ where: { id: payment.tenantId } });
      if (tenantProfile) {
        await this.notificationsQueue.add('payment-approved', {
          tenantId: tenantProfile.userId,
          paymentId: id,
          billId: payment.billId,
        });
      }
    } catch (_err) { /* fire-and-forget */ }

    return updated;
  }

  async rejectPayment(id: string, userId: string, role: string, dto: RejectPaymentDto) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can reject payments');
    const payment = await this.prisma.payment.findUnique({ where: { id }, include: { bill: true } });
    if (!payment) throw new NotFoundException('Payment not found');

    const houseId = await this.landlordHouseId(userId);
    if (payment.bill.houseId !== houseId) throw new ForbiddenException('Access denied');

    const updated = await this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REJECTED, reviewedAt: new Date(), rejectionReason: dto.rejectionReason },
    });
    await this.prisma.bill.update({ where: { id: payment.billId }, data: { status: BillStatus.UNPAID } });

    try {
      const tenantProfile = await this.prisma.tenantProfile.findUnique({ where: { id: payment.tenantId } });
      if (tenantProfile) {
        await this.notificationsQueue.add('payment-rejected', {
          tenantId: tenantProfile.userId,
          paymentId: id,
          billId: payment.billId,
          reason: dto.rejectionReason,
        });
      }
    } catch (_err) { /* fire-and-forget */ }

    return updated;
  }

  async landlordRecord(userId: string, role: string, dto: LandlordRecordDto) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can record payments');
    const houseId = await this.landlordHouseId(userId);

    const bill = await this.prisma.bill.findUnique({ where: { id: dto.billId } });
    if (!bill || bill.houseId !== houseId) throw new NotFoundException('Bill not found');

    const tenantProfile = await this.prisma.tenantProfile.findFirst({ where: { id: dto.tenantId, houseId } });
    if (!tenantProfile) throw new NotFoundException('Tenant not found in your house');

    const payment = await this.prisma.payment.create({
      data: {
        billId: dto.billId,
        tenantId: tenantProfile.id,
        amount: dto.amount,
        notes: dto.notes,
        addedByLandlord: true,
        status: PaymentStatus.APPROVED,
        reviewedAt: new Date(),
      },
    });

    await this.prisma.bill.update({ where: { id: dto.billId }, data: { status: BillStatus.PAID } });
    return payment;
  }
}
