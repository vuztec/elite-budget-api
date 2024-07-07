import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class JointSplit extends CustomBaseEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  SelfAmount: Number;
}
