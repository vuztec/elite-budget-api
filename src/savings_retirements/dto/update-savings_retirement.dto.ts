import { PartialType } from '@nestjs/swagger';
import { CreateSavingsRetirementDto } from './create-savings_retirement.dto';

export class UpdateSavingsRetirementDto extends PartialType(CreateSavingsRetirementDto) {}
