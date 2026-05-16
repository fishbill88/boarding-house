import { IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class GenerateBillsDto {
  @IsInt()
  @Min(1)
  @Max(12)
  billingMonth: number;

  @IsInt()
  @Min(2020)
  billingYear: number;

  @IsNumber()
  @IsOptional()
  electricityAmount?: number;

  @IsNumber()
  @IsOptional()
  waterAmount?: number;
}
