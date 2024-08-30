import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { GOAL_TYPE, DEBT_CATEGORY, EXPENSES_CATEGORY, MAIN_CATEGORY } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Goal extends CustomBaseEntity {
  @Column({ type: 'enum', enum: GOAL_TYPE, default: GOAL_TYPE.DEBT })
  Type: GOAL_TYPE;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  Percentage: number;

  @Column({ type: 'enum', enum: { ...DEBT_CATEGORY, ...EXPENSES_CATEGORY, ...MAIN_CATEGORY } })
  Category: DEBT_CATEGORY | EXPENSES_CATEGORY | MAIN_CATEGORY;
}
