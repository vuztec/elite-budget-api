import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Coupon extends CustomBaseEntity {
  @Column({ nullable: true })
  @ApiProperty()
  Description: string;

  @Column({ unique: true })
  @ApiProperty()
  Code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  Percentage: number;

  @Column({ type: 'datetime' })
  @ApiProperty()
  StartDate: Date;

  @Column({ type: 'datetime' })
  @ApiProperty()
  EndDate: Date;

  @Column({ nullable: true, default: 0 })
  @ApiProperty()
  Qty: number;
}
