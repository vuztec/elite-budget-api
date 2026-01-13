import { DEBT_CATEGORY, Frequency, Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDebtDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  LoanBalance: number;

  @IsNumber()
  MonthlyBudget: number;

  @IsString()
  Description: string;

  @IsString()
  NickName: string;

  @IsString()
  PaymentMethod: PAYMENT_METHOD;

  @IsString()
  DueDate: string;

  @IsString()
  Category: DEBT_CATEGORY;

  @IsEnum(Frequency)
  @IsOptional()
  Frequency: Frequency;
}
