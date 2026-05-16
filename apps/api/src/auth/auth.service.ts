import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@bhaus/types';
import { compare, hash } from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { generateHouseCode } from '@bhaus/utils';

interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    if (dto.role === UserRole.TENANT && !dto.houseCode) {
      throw new BadRequestException('houseCode is required for tenant registration');
    }

    if (dto.role === UserRole.LANDLORD && (!dto.houseName || !dto.houseAddress)) {
      throw new BadRequestException('houseName and houseAddress are required for landlord registration');
    }

    const passwordHash = await hash(dto.password, 10);

    if (dto.role === UserRole.LANDLORD) {
      const result = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const user = await tx.user.create({
          data: {
            email: dto.email,
            fullName: dto.fullName,
            phone: dto.phone,
            passwordHash,
            role: UserRole.LANDLORD,
          },
        });

        const house = await tx.house.create({
          data: {
            houseCode: generateHouseCode(),
            name: dto.houseName!,
            address: dto.houseAddress!,
            landlordId: user.id,
          },
        });

        await tx.houseSettings.create({
          data: {
            houseId: house.id,
          },
        });

        return user;
      });

      return this.issueTokens(result.id, result.email, result.role);
    }

    const house = await this.prisma.house.findUnique({ where: { houseCode: dto.houseCode } });
    if (!house) {
      throw new BadRequestException('Invalid house code');
    }

    const tenantUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        phone: dto.phone,
        passwordHash,
        role: UserRole.TENANT,
        tenantProfile: {
          create: {
            houseId: house.id,
          },
        },
      },
    });

    return this.issueTokens(tenantUser.id, tenantUser.email, tenantUser.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueTokens(user.id, user.email, user.role as UserRole);
  }

  async refresh(dto: RefreshDto) {
    const tokenRecord = await this.prisma.refreshToken.findUnique({ where: { token: dto.refreshToken }, include: { user: true } });
    if (!tokenRecord || tokenRecord.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const payload: JwtPayload = { sub: tokenRecord.user.id, email: tokenRecord.user.email, role: tokenRecord.user.role as UserRole };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    return { accessToken };
  }

  async logout(dto: RefreshDto) {
    await this.prisma.refreshToken.deleteMany({ where: { token: dto.refreshToken } });
    return { message: 'Logged out successfully' };
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, include: { tenantProfile: true, house: true } });
  }

  private async issueTokens(userId: string, email: string, role: UserRole) {
    const payload: JwtPayload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }),
      this.jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '30d' }),
    ]);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }
}
