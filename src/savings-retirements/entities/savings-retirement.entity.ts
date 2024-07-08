import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner, PAYMENT_METHOD, SAV_RET_TYPE } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class SavingsRetirement extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: Owner.SELF })
  Owner: Owner;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  MarketValue: Number;

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

  @Column({ type: 'enum', enum: SAV_RET_TYPE, default: SAV_RET_TYPE.SAVINGS })
  Type: SAV_RET_TYPE;

  @Column({ type: 'enum', enum: SAV_RET_TYPE, default: SAV_RET_TYPE.SAVINGS })
  Category: SAV_RET_TYPE;
}
