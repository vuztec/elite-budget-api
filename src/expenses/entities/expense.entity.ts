import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { EXPENSES_CATEGORY, Frequency, Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Expense extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: null })
  Owner: Owner;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  MarketValue: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: null })
  @ApiProperty()
  LoanBalance: number;

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

  @Column({ type: 'enum', enum: EXPENSES_CATEGORY, default: EXPENSES_CATEGORY.HOUSING })
  Category: EXPENSES_CATEGORY;

  @Column({ type: 'enum', enum: Frequency, default: Frequency.MONTHLY })
  Frequency: Frequency;
}
