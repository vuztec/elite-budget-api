import { PartialType } from '@nestjs/swagger';
import { CreateRootuserDto } from './create-rootuser.dto';

export class UpdateRootuserDto extends PartialType(CreateRootuserDto) {}
