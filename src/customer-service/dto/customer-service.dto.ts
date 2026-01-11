import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CustomerServiceDto {
  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Customer email', example: 'john@example.com' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @ApiProperty({ description: 'Subject of the message', example: 'Need help with subscription' })
  @IsString()
  subject: string;

  @ApiProperty({ description: 'Message content', example: 'I need help with my subscription...' })
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters.' })
  message: string;

  @ApiProperty({ description: 'reCAPTCHA token (optional)', required: false })
  @IsOptional()
  @IsString()
  recaptchaToken?: string;

  @ApiProperty({ description: 'Source of submission (optional)', required: false, example: 'web' })
  @IsOptional()
  @IsString()
  source?: string;
}
