import { IsString } from 'class-validator';
import { z } from 'zod';

export const idUploadSchema = z.object({
  contentType: z.string().min(1),
});

export class IdUploadDto {
  @IsString()
  contentType!: string;
}
