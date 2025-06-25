import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  PaymentMethodId: string;

  @IsString()
  @IsOptional()
  Coupon: string;

  @IsBoolean()
  @IsOptional()
  isTrial: boolean;
}
