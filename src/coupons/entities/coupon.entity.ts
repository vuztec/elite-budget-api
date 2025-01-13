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
}
