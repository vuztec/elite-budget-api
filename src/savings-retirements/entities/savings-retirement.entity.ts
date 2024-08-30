import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner, PAYMENT_METHOD, SAV_RET_TYPE } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class SavingsRetirement extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: null })
  Owner: Owner;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  MarketValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  MonthlyBudget: number;

  @Column()
  @ApiProperty()
  Description: string;

  @Column()
  @ApiProperty()
  NickName: string;

  @Column({ type: 'enum', enum: PAYMENT_METHOD, default: PAYMENT_METHOD.AUTO_DEBIT })
  PaymentMethod: PAYMENT_METHOD;

  @Column({ default: '01' })
  @ApiProperty()
  DueDate: string;

  @Column({ type: 'enum', enum: SAV_RET_TYPE, default: SAV_RET_TYPE.SAVINGS })
  Type: SAV_RET_TYPE;

  @Column({ type: 'enum', enum: SAV_RET_TYPE, default: SAV_RET_TYPE.SAVINGS })
  Category: SAV_RET_TYPE;
}
