import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BankAccountTransaction } from './bank-account-transaction.entity';

@Entity()
export class BankAccountName extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: Owner.SELF })
  Owner: Owner;

  @Column()
  @ApiProperty()
  Name: string;

  @OneToMany(() => BankAccountTransaction, (transaction) => transaction.BankAccountName)
  transactions: BankAccountTransaction[];
}
