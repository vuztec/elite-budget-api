import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('debt')
@ApiTags('Debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.debtService.create(createDebtDto, user);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.debtService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.debtService.update(+id, updateDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(+id);
  }
}
