import { Owner, TRANSACTION_TYPE } from '@/shared/enums/enum';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateExtraFundsTrackerDto {
  @IsString()
  Owner: Owner;

  @IsString()
  Description: string;

  @IsString()
  Date: Date;

  @IsBoolean()
  IsDateKnown: boolean;

  @IsString()
  Type: TRANSACTION_TYPE;

  @IsNumber()
  Amount: number;
}

export class CreateBalanceDto {
  @IsNumber()
  Balance: number;
}
