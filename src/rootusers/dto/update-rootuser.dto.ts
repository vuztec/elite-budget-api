import { PartialType } from '@nestjs/swagger';
import { CreateRootuserDto } from './create-rootuser.dto';
import { IsBoolean } from 'class-validator';

export class UpdateRootuserDto extends PartialType(CreateRootuserDto) {}

export class UpdateUserAutoRenewalDto {
  @IsBoolean()
  Auto_Renewal: boolean;
}
