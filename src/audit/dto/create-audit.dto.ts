import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional, IsString, IsNumber } from 'class-validator';
import { AuditAction } from '../entities/audit.entity';

export class CreateAuditDto {
  @ApiProperty({ enum: AuditAction })
  @IsEnum(AuditAction)
  Action: AuditAction;

  @ApiProperty()
  @IsBoolean()
  AutoRenewalStatus: boolean;

  @ApiProperty()
  @IsNumber()
  UserId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  IpAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  UserAgent?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  Notes?: string;
}
