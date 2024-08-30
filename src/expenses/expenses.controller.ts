import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('expenses')
@ApiTags('Expense')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.expensesService.create(createExpenseDto, user);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.expensesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @Req() req: Request & { user: Rootuser },
  ) {
    const { user } = req;
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
