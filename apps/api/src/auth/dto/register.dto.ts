import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '@bhaus/types';
import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email(),
    fullName: z.string().min(1),
    phone: z.string().optional(),
    password: z.string().min(8),
    role: z.nativeEnum(UserRole),
    houseCode: z.string().min(8).optional(),
    houseName: z.string().optional(),
    houseAddress: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role === UserRole.TENANT && !value.houseCode) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['houseCode'], message: 'houseCode is required for tenant registration' });
    }

    if (value.role === UserRole.LANDLORD && (!value.houseName || !value.houseAddress)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['houseName'], message: 'houseName and houseAddress are required for landlord registration' });
    }
  });

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  houseCode?: string;

  @IsOptional()
  @IsString()
  houseName?: string;

  @IsOptional()
  @IsString()
  houseAddress?: string;
}
