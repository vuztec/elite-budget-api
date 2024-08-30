import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountNameDto, CreateBankAccountTransactionDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountNameDto, UpdateBankAccountTransactionDto } from './dto/update-bank-account.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('bank-accounts')
@ApiTags('Bank Accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post('name')
  createName(@Body() createBankAccountDto: CreateBankAccountNameDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.createName(createBankAccountDto, user);
  }

  @Post('transaction')
  createTransaction(
    @Body() createBankAccountDto: CreateBankAccountTransactionDto,
    @Req() req: Request & { user: Rootuser },
  ) {
    const { user } = req;
    return this.bankAccountsService.createTransaction(createBankAccountDto, user);
  }

  @Get('name')
  findAllName(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.findAllNames(user);
  }

  @Get('transaction')
  findAllTransaction(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.findAllTransactions(user);
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
  updateName(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountNameDto,
    @Req() req: Request & { user: Rootuser },
  ) {
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

  @Patch('transaction/:id/status')
  updateTransactionStatus(@Param('id') id: string, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.updateTransactionStatus(+id);
  }

  @Patch('transaction/:id/tax')
  updateTransactionTax(@Param('id') id: string, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.bankAccountsService.updateTransactionTax(+id);
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
