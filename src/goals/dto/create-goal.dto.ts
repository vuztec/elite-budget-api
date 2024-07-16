import { DEBT_CATEGORY, EXPENSES_CATEGORY, GOAL_TYPE, MAIN_CATEGORY } from '@/shared/enums/enum';
import { IsNumber, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  Category: MAIN_CATEGORY | DEBT_CATEGORY | EXPENSES_CATEGORY;

  @IsNumber()
  Percentage: Number;
}
