import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  Description: string;

  @IsString()
  @IsOptional()
  Code: string;

  @IsNumber()
  Percentage: number;
}
