import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { EXPENSES_CATEGORY, Owner, PAYMENT_METHOD } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class Expense extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: Owner.SELF })
  Owner: Owner;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  MarketValue: Number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  LoanBalance: Number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  MonthlyBudget: Number;

  @Column()
  @ApiProperty()
  Description: string;

  @Column({ type: 'enum', enum: PAYMENT_METHOD, default: PAYMENT_METHOD.AUTO_DEBIT })
  PaymentMethod: PAYMENT_METHOD;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  DueDate: Date;

  @Column({ type: 'enum', enum: EXPENSES_CATEGORY, default: EXPENSES_CATEGORY.HOUSING })
  Category: EXPENSES_CATEGORY;
}
