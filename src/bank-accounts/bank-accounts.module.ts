import { Global, Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountName } from './entities/bank-account-Name.entity';
import { BankAccountTransaction } from './entities/bank-account-transaction.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BankAccountName, BankAccountTransaction])],
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
})
export class BankAccountsModule {}
