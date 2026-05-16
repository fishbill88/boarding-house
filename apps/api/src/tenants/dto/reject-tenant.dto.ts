import { IsString } from 'class-validator';
import { z } from 'zod';

export const rejectTenantSchema = z.object({
  reason: z.string().min(1),
});

export class RejectTenantDto {
  @IsString()
  reason!: string;
}
