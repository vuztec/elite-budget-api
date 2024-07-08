import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountNameDto, CreateBankAccountTransactionDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountNameDto, UpdateBankAccountTransactionDto } from './dto/update-bank-account.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post('name')
  createName(@Body() createBankAccountDto: CreateBankAccountNameDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.createName(createBankAccountDto, user);
  }

  @Post('transaction')
  createTransaction(@Body() createBankAccountDto: CreateBankAccountTransactionDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.createTransaction(createBankAccountDto, user);
  }

  @Get()
  findAllName() {
    return this.bankAccountsService.findAllNames();
  }

  @Get()
  findAllTransaction() {
    return this.bankAccountsService.findAllTransactions();
  }

  @Get('name/:id')
  findOneName(@Param('id') id: string) {
    return this.bankAccountsService.findOneName(+id);
  }

  @Get('transaction/:id')
  findOneTransaction(@Param('id') id: string) {
    return this.bankAccountsService.findOneTransaction(+id);
  }

  @Patch('name/:id')
  updateName(@Param('id') id: string, @Body() updateBankAccountDto: UpdateBankAccountNameDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.updateName(+id, updateBankAccountDto);
  }

  @Patch('transaction/:id')
  updateTransaction(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountTransactionDto,
    @Req() req: Request & { user: Rootuser },
  ) {
    const { user } = req;
    return this.bankAccountsService.updateTransaction(+id, updateBankAccountDto);
  }

  @Delete('name/:id')
  removeName(@Param('id') id: string) {
    return this.bankAccountsService.removeName(+id);
  }

  @Delete('transaction/:id')
  removeTransaction(@Param('id') id: string) {
    return this.bankAccountsService.removeTransaction(+id);
  }
}
