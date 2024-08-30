import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExtraPayCheckDto {
  @IsNumber()
  SelfAmount: number;

  @IsNumber()
  PartnerAmount: number;

  @IsString()
  @IsOptional()
  Date: Date;
}
