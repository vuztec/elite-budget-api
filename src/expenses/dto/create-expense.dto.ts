import { Frequency, Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  Owner: Owner;

  @IsNumber()
  @IsOptional()
  MarketValue: number;

  @IsNumber()
  @IsOptional()
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

  @IsEnum(Frequency)
  @IsOptional()
  Frequency: Frequency;
}
