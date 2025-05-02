import { IsEmail, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsEmail()
  Email: string;

  @IsString()
  Code: string;
}
