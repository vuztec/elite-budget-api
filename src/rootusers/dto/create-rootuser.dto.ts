import { Status } from '@/shared/enums/enum';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRootuserDto {
  @IsString()
  FullName: string;

  @IsEmail({}, { message: 'Invalid email' })
  Email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(32, { message: 'Password must be at most 32 characters long' })
  Password: string;

  @IsString()
  Separator: string;

  @IsString()
  Country: string;

  @IsString()
  @IsOptional()
  Province: string;

  @IsString()
  @IsOptional()
  City: string;

  @IsString()
  @IsOptional()
  Address: string;

  @IsString()
  @IsOptional()
  Currency: string;

  @IsString()
  @IsOptional()
  DateFormat: string;

  @IsNumber()
  @IsOptional()
  PartnerAge: number;

  @IsNumber()
  @IsOptional()
  SelfAge: number;

  @IsEnum(Status)
  @IsOptional()
  Status: Status;
}
