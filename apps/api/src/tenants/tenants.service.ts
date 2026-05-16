import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantStatus, UserRole } from '@bhaus/types';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { ApproveTenantDto } from './dto/approve-tenant.dto';
import { RejectTenantDto } from './dto/reject-tenant.dto';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private async landlordHouseId(userId: string): Promise<string> {
    const house = await this.prisma.house.findUnique({ where: { landlordId: userId } });
    if (!house) throw new NotFoundException('House not found');
    return house.id;
  }

  async list(userId: string, role: UserRole) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlord can list tenants');
    const houseId = await this.landlordHouseId(userId);
    return this.prisma.tenantProfile.findMany({ where: { houseId }, include: { user: true } });
  }

  async detail(id: string, userId: string, role: UserRole) {
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { id }, include: { user: true } });
    if (!tenant) throw new NotFoundException('Tenant not found');

    if (role === UserRole.TENANT && tenant.userId !== userId) {
      throw new ForbiddenException('Cannot view other tenants');
    }

    if (role === UserRole.LANDLORD) {
      const houseId = await this.landlordHouseId(userId);
      if (tenant.houseId !== houseId) throw new ForbiddenException('Tenant does not belong to your house');
    }

    return tenant;
  }

  async approve(id: string, userId: string, role: UserRole, dto: ApproveTenantDto) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlord can approve');
    const houseId = await this.landlordHouseId(userId);
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { id } });
    if (!tenant || tenant.houseId !== houseId) throw new NotFoundException('Tenant not found');

    return this.prisma.tenantProfile.update({
      where: { id },
      data: {
        roomNumber: dto.roomNumber,
        status: TenantStatus.APPROVED,
        approvedAt: new Date(),
        approvedBy: userId,
      },
    });
  }

  async reject(id: string, userId: string, role: UserRole, dto: RejectTenantDto) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlord can reject');
    const houseId = await this.landlordHouseId(userId);
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { id } });
    if (!tenant || tenant.houseId !== houseId) throw new NotFoundException('Tenant not found');

    const profile = await this.prisma.tenantProfile.update({
      where: { id },
      data: {
        status: TenantStatus.REJECTED,
        approvedBy: userId,
      },
    });

    return { ...profile, rejectionReason: dto.reason };
  }

  async deactivate(id: string, userId: string, role: UserRole) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlord can deactivate');
    const houseId = await this.landlordHouseId(userId);
    const tenant = await this.prisma.tenantProfile.findUnique({ where: { id }, include: { user: true } });
    if (!tenant || tenant.houseId !== houseId) throw new NotFoundException('Tenant not found');

    return this.prisma.user.update({ where: { id: tenant.userId }, data: { isActive: false } });
  }

  async uploadId(userId: string, role: UserRole, contentType: string) {
    if (role !== UserRole.TENANT) throw new ForbiddenException('Only tenants can upload IDs');
    const key = `tenant-ids/${userId}-${Date.now()}`;
    const uploadUrl = await this.storage.getUploadUrl(key, contentType);
    const fileUrl = await this.storage.getFileUrl(key);

    await this.prisma.tenantProfile.update({ where: { userId }, data: { validIdUrl: key } });

    return { uploadUrl, fileUrl };
  }

  async pending(userId: string, role: UserRole) {
    if (role !== UserRole.LANDLORD) throw new ForbiddenException('Only landlord can list pending tenants');
    const houseId = await this.landlordHouseId(userId);

    return this.prisma.tenantProfile.findMany({
      where: {
        houseId,
        status: TenantStatus.PENDING,
      },
      include: { user: true },
    });
  }
}
