import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  PaymentMethodId: string;

  @IsBoolean()
  @IsOptional()
  isTrial: boolean;
}
