import { PartialType } from '@nestjs/swagger';
import { CreateSavingsRetirementDto } from './create-savings-retirement.dto';

export class UpdateSavingsRetirementDto extends PartialType(CreateSavingsRetirementDto) {}
