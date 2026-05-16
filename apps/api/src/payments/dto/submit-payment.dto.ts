import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';

export class SubmitPaymentDto {
  @IsString()
  billId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  proofImageUrl?: string;
}
