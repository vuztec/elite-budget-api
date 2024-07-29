import { PartialType } from '@nestjs/swagger';
import { CreateBalanceDto, CreateExtraFundsTrackerDto } from './create-extra-funds-tracker.dto';

export class UpdateExtraFundsTrackerDto extends PartialType(CreateExtraFundsTrackerDto) {}

export class UpdateBalanceDto extends PartialType(CreateBalanceDto) {}
