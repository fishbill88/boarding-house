import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@bhaus/types';
import { generateHouseCode } from '@bhaus/utils';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateHouseDto } from './dto/update-house.dto';
import { UpdateHouseSettingsDto } from './dto/update-house-settings.dto';

@Injectable()
export class HouseService {
  constructor(private readonly prisma: PrismaService) {}

  private async getLandlordHouse(userId: string) {
    const house = await this.prisma.house.findUnique({ where: { landlordId: userId }, include: { settings: true } });
    if (!house) {
      throw new NotFoundException('House not found');
    }
    return house;
  }

  async getHouse(userId: string, role: UserRole) {
    if (role !== UserRole.LANDLORD) {
      throw new ForbiddenException('Only landlords can access this endpoint');
    }

    return this.getLandlordHouse(userId);
  }

  async updateHouse(userId: string, role: UserRole, dto: UpdateHouseDto) {
    if (role !== UserRole.LANDLORD) {
      throw new ForbiddenException('Only landlords can update house');
    }

    const house = await this.getLandlordHouse(userId);
    return this.prisma.house.update({ where: { id: house.id }, data: dto });
  }

  async getSettings(userId: string, role: UserRole) {
    if (role !== UserRole.LANDLORD) {
      throw new ForbiddenException('Only landlords can access this endpoint');
    }

    const house = await this.getLandlordHouse(userId);
    return house.settings;
  }

  async updateSettings(userId: string, role: UserRole, dto: UpdateHouseSettingsDto) {
    if (role !== UserRole.LANDLORD) {
      throw new ForbiddenException('Only landlords can update settings');
    }

    const house = await this.getLandlordHouse(userId);
    return this.prisma.houseSettings.update({ where: { houseId: house.id }, data: dto });
  }

  async getCode(userId: string, role: UserRole) {
    const house = await this.getHouse(userId, role);
    return { houseCode: house.houseCode };
  }

  async regenerateCode(userId: string, role: UserRole) {
    const house = await this.getHouse(userId, role);
    return this.prisma.house.update({ where: { id: house.id }, data: { houseCode: generateHouseCode() } });
  }
}
