import { PartialType } from '@nestjs/swagger';
import { CreateJointSplitDto } from './create-joint-split.dto';

export class UpdateJointSplitDto extends PartialType(CreateJointSplitDto) {}
