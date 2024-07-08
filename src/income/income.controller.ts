import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.incomeService.create(createIncomeDto, user);
  }

  @Get()
  findAll() {
    return this.incomeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.incomeService.update(+id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomeService.remove(+id);
  }
}
