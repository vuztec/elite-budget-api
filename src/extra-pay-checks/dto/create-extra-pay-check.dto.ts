import { IsNumber, IsString } from 'class-validator';

export class CreateExtraPayCheckDto {
  @IsNumber()
  SelfAmount: Number;

  @IsNumber()
  PartnerAmount: Number;

  @IsString()
  Date: Date;
}
