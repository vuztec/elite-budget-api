import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner, TRANSACTION_TYPE } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BankAccountName } from './bank-account-name.entity';

@Entity()
export class BankAccountTransaction extends CustomBaseEntity {
  @Column({ type: 'date' })
  @ApiProperty()
  Date: Date;

  @Column()
  @ApiProperty()
  Description: string;

  @Column({ type: 'enum', enum: TRANSACTION_TYPE, default: TRANSACTION_TYPE.CREDIT })
  Type: TRANSACTION_TYPE;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  Amount: number;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  IsCleared: boolean;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  IsDateKnown: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  Taxable: boolean;

  @ManyToOne(() => BankAccountName, (bankAccountName) => bankAccountName.transactions, { onDelete: 'CASCADE' })
  @ApiProperty()
  BankAccountName: BankAccountName;
}
