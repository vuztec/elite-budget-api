import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExtraPayCheckDto {
  @IsNumber()
  SelfAmount: Number;

  @IsNumber()
  PartnerAmount: Number;

  @IsString()
  @IsOptional()
  Date: Date;
}
