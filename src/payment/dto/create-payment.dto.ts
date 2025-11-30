import { IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsOptional()
  coupon?: string;
}
