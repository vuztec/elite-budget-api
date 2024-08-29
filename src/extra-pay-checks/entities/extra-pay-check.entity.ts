import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class ExtraPayCheck extends CustomBaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  SelfAmount: Number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  PartnerAmount: Number;

  @Column({ type: 'date', nullable: true })
  @ApiProperty()
  Date: Date;
}
