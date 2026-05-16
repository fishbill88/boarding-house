import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class LandlordRecordDto {
  @IsString()
  billId: string;

  @IsString()
  tenantId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
