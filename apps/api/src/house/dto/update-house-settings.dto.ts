import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { z } from 'zod';

export const updateHouseSettingsSchema = z.object({
  rentAmount: z.number().nonnegative().optional(),
  rentDueDay: z.number().int().min(1).max(31).optional(),
  electricityEnabled: z.boolean().optional(),
  waterEnabled: z.boolean().optional(),
  notifyDaysBefore: z.number().int().min(0).optional(),
  gracePeriodDays: z.number().int().min(0).optional(),
  customBillings: z.array(z.string()).optional(),
});

export class UpdateHouseSettingsDto {
  @IsOptional()
  @Min(0)
  rentAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  rentDueDay?: number;

  @IsOptional()
  @IsBoolean()
  electricityEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  waterEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  notifyDaysBefore?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  gracePeriodDays?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customBillings?: string[];
}
