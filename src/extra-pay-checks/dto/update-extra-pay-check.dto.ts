import { PartialType } from '@nestjs/swagger';
import { CreateExtraPayCheckDto } from './create-extra-pay-check.dto';

export class UpdateExtraPayCheckDto extends PartialType(CreateExtraPayCheckDto) {}
