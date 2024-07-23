import { Global, Module } from '@nestjs/common';
import { BankAccountsService } from '@/bank-accounts/bank-accounts.service';
import { BankAccountsController } from '@/bank-accounts/bank-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountName } from '@/bank-accounts/entities/bank-account-name.entity';
import { BankAccountTransaction } from '@/bank-accounts/entities/bank-account-transaction.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BankAccountName, BankAccountTransaction])],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
