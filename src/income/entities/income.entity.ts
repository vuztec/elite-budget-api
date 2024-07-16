import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Frequency, Owner } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Income extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: Owner.SELF })
  Owner: Owner;

  @Column({ type: 'enum', enum: Frequency, default: Frequency.MONTHLY })
  Frequency: Frequency;

  @Column()
  @ApiProperty()
  IncomeSource: String;

  @Column()
  @ApiProperty()
  NickName: String;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  GrossAmount: Number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  NetAmount: Number;
}
