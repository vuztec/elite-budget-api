import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  Email: string;

  @IsString()
  @MinLength(8, { message: 'Password should be greater than 8 characters' })
  @MaxLength(32, { message: 'Password should be less than 32 characters' })
  Password: string;
}
