import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

export class UpdatePasswordDto {
  @IsString()
  CurrentPassword: string;

  @IsString()
  NewPassword: string;
}
