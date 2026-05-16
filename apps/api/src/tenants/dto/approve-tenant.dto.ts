import { IsOptional, IsString } from 'class-validator';
import { z } from 'zod';

export const approveTenantSchema = z.object({
  roomNumber: z.string().optional(),
});

export class ApproveTenantDto {
  @IsOptional()
  @IsString()
  roomNumber?: string;
}
