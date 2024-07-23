import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner, TRANSACTION_TYPE } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BankAccountName } from './bank-account-names.entity';

@Entity()
export class BankAccountTransaction extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: Owner.SELF })
  Owner: Owner;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  Date: Date;

  @Column()
  @ApiProperty()
  Description: string;

  @Column({ type: 'enum', enum: TRANSACTION_TYPE, default: TRANSACTION_TYPE.CREDIT })
  Type: TRANSACTION_TYPE;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  Amount: Number;

  @Column({ type: 'boolean' })
  @ApiProperty()
  IsCleared: boolean;

  @ManyToOne(() => BankAccountName, (bankAccountName) => bankAccountName.transactions)
  @ApiProperty()
  BankAccountName: BankAccountName;
}
