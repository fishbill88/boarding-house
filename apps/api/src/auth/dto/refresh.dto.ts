import { IsString } from 'class-validator';
import { z } from 'zod';

export const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}
