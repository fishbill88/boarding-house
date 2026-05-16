import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ApplianceStatus, BillType, UserRole } from '@bhaus/types';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterApplianceDto } from './dto/register-appliance.dto';
import { ApproveApplianceDto } from './dto/approve-appliance.dto';

@Injectable()
export class AppliancesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('NOTIFICATIONS_QUEUE') private readonly notificationsQueue: Queue,
  ) {}

  private async landlordHouseId(userId: string): Promise<string> {
    const house = await this.prisma.house.findUnique({ where: { landlordId: userId } });
    if (!house) throw new NotFoundException('House not found');
    return house.id;
  }

  async register(userId: string, role: string, dto: RegisterApplianceDto) {
    if (role !== UserRole.TENANT) throw new ForbiddenException('Only tenants can register appliances');

    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');
    if (tenant.houseId !== dto.houseId) throw new ForbiddenException('House mismatch');

    return this.prisma.appliance.create({
      data: {
        tenantId: tenant.id,
        houseId: dto.houseId,
        name: dto.name,
        description: dto.description,
        watts: dto.watts,
        status: ApplianceStatus.PENDING,
        billingType: 'FREE',
        registrationFee: 0,
      },
    });
  }

  async listMine(userId: string) {
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');
    return this.prisma.appliance.findMany({ where: { tenantId: tenant.id }, orderBy: { createdAt: 'desc' } });
  }

  async listAll(userId: string, role: string, filters: { status?: string; tenantId?: string }) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can list all appliances');
    const houseId = await this.landlordHouseId(userId);

    const where: Record<string, unknown> = { houseId };
    if (filters.status) where['status'] = filters.status;
    if (filters.tenantId) where['tenantId'] = filters.tenantId;

    return this.prisma.appliance.findMany({ where, include: { tenant: { include: { user: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async get(id: string, userId: string, role: string) {
    const appliance = await this.prisma.appliance.findUnique({ where: { id }, include: { tenant: { include: { user: true } } } });
    if (!appliance) throw new NotFoundException('Appliance not found');

    if (role === UserRole.LANDLORD) {
      const houseId = await this.landlordHouseId(userId);
      if (appliance.houseId !== houseId) throw new ForbiddenException('Access denied');
    } else {
      const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
      if (!tenant || appliance.tenantId !== tenant.id) throw new ForbiddenException('Access denied');
    }

    return appliance;
  }

  async approve(id: string, userId: string, role: string, dto: ApproveApplianceDto) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can approve appliances');
    const houseId = await this.landlordHouseId(userId);
    const appliance = await this.prisma.appliance.findUnique({ where: { id }, include: { tenant: { include: { user: true } } } });
    if (!appliance || appliance.houseId !== houseId) throw new NotFoundException('Appliance not found');

    const updated = await this.prisma.appliance.update({
      where: { id },
      data: {
        status: ApplianceStatus.APPROVED,
        billingType: dto.billingType,
        registrationFee: dto.registrationFee ?? 0,
      },
    });

    if (dto.registrationFee && dto.registrationFee > 0) {
      const now = new Date();
      await this.prisma.bill.create({
        data: {
          tenantId: appliance.tenantId,
          houseId,
          type: BillType.APPLIANCE,
          amount: dto.registrationFee,
          dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
          billingMonth: now.getMonth() + 1,
          billingYear: now.getFullYear(),
          applianceId: id,
          notes: `Registration fee for ${appliance.name}`,
        },
      });
    }

    try {
      await this.notificationsQueue.add('appliance-approved', {
        tenantId: appliance.tenant.userId,
        applianceName: appliance.name,
        applianceId: id,
      });
    } catch (_err) { /* fire-and-forget */ }

    return updated;
  }

  async reject(id: string, userId: string, role: string) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlords can reject appliances');
    const houseId = await this.landlordHouseId(userId);
    const appliance = await this.prisma.appliance.findUnique({ where: { id }, include: { tenant: true } });
    if (!appliance || appliance.houseId !== houseId) throw new NotFoundException('Appliance not found');

    const updated = await this.prisma.appliance.update({ where: { id }, data: { status: ApplianceStatus.REJECTED } });

    try {
      const tenant = await this.prisma.tenantProfile.findUnique({ where: { id: appliance.tenantId } });
      if (tenant) {
        await this.notificationsQueue.add('appliance-rejected', {
          tenantId: tenant.userId,
          applianceName: appliance.name,
          applianceId: id,
        });
      }
    } catch (_err) { /* fire-and-forget */ }

    return updated;
  }

  async delete(id: string, userId: string, role: string) {
    if (role !== UserRole.TENANT) throw new ForbiddenException('Only tenants can delete appliances');
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { userId } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');

    const appliance = await this.prisma.appliance.findUnique({ where: { id } });
    if (!appliance || appliance.tenantId !== tenant.id) throw new NotFoundException('Appliance not found');
    if (appliance.status !== ApplianceStatus.PENDING) throw new ForbiddenException('Only PENDING appliances can be deleted');

    return this.prisma.appliance.delete({ where: { id } });
  }
}
