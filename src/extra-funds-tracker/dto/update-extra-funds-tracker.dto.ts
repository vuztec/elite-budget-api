import { PartialType } from '@nestjs/swagger';
import { CreateExtraFundsTrackerDto } from './create-extra-funds-tracker.dto';

export class UpdateExtraFundsTrackerDto extends PartialType(CreateExtraFundsTrackerDto) {}
