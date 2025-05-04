import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsEmail()
  Email: string;

  @IsString()
  Code: string;

  @IsString()
  @IsOptional()
  type: string;
}
