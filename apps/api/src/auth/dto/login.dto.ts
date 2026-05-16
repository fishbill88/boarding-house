import { IsEmail, IsString } from 'class-validator';
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
