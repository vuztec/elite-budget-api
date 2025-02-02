import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Frequency, Owner } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Income extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: null })
  Owner: Owner;

  @Column({ type: 'enum', enum: Frequency, default: Frequency.MONTHLY })
  Frequency: Frequency;

  @Column()
  @ApiProperty()
  IncomeSource: String;

  @Column()
  @ApiProperty()
  NickName: String;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  GrossAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  NetAmount: number;
}
