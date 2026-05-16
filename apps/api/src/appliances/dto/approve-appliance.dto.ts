import { IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { BillingType } from '@bhaus/types';

export class ApproveApplianceDto {
  @IsEnum(BillingType)
  billingType: BillingType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  registrationFee?: number;
}
