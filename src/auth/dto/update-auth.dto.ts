import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}

export class UpdatePasswordDto {
  @IsString()
  CurrentPassword: string;

  @IsString()
  NewPassword: string;
}

export class ChangePasswordDto {
  @IsString()
  Password: string;

  @IsNumber()
  otpId: number;
}

export class ForgetPasswordDto {
  @IsEmail()
  Email: string;
}
