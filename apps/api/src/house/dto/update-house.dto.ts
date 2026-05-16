import { IsOptional, IsString } from 'class-validator';
import { z } from 'zod';

export const updateHouseSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

export class UpdateHouseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
