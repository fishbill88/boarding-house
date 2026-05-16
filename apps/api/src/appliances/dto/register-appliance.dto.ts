import { IsInt, IsOptional, IsString } from 'class-validator';

export class RegisterApplianceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  watts?: number;

  @IsString()
  houseId: string;
}
