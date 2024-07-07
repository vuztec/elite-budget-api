import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRootuserDto {
  @IsString()
  FullName: string;

  @IsEmail({}, { message: 'Invalid email' })
  Email: string;

  @IsString()
  @MinLength(8, { message: 'Contact must be at least 8 characters long' })
  @MaxLength(15, { message: 'Contact must be at most 15 characters long' })
  Contact: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  Password: string;

  @IsString()
  Separator: string;

  @IsString()
  Country: string;

  @IsString()
  Province: string;

  @IsString()
  City: string;

  @IsString()
  Address: string;

  @IsString()
  Currency: string;

  @IsString()
  DateFormat: string;
}
