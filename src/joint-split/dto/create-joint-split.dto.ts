import { IsNumber } from 'class-validator';

export class CreateJointSplitDto {
  @IsNumber()
  SelfAmount: Number;
}
