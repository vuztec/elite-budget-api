import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BankAccountTransaction } from './bank-account-transaction.entity';

@Entity()
export class BankAccountName extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: null })
  Owner: Owner;

  @Column()
  @ApiProperty()
  Name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  OpeningBalance: number;

  @OneToMany(() => BankAccountTransaction, (transaction) => transaction.BankAccountName, { cascade: ['remove'] })
  transactions: BankAccountTransaction[];
}
