import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { SavingsRetirementsService } from './savings-retirements.service';
import { CreateSavingsRetirementDto } from './dto/create-savings-retirement.dto';
import { UpdateSavingsRetirementDto } from './dto/update-savings-retirement.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Controller('savings-retirements')
export class SavingsRetirementsController {
  constructor(private readonly savingsRetirementsService: SavingsRetirementsService) {}

  @Post()
  create(@Body() createSavingsRetirementDto: CreateSavingsRetirementDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.savingsRetirementsService.create(createSavingsRetirementDto);
  }

  @Get()
  findAll() {
    return this.savingsRetirementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingsRetirementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSavingsRetirementDto: UpdateSavingsRetirementDto,
    @Req() req: Request & { user: Rootuser },
  ) {
    const { user } = req;
    return this.savingsRetirementsService.update(+id, updateSavingsRetirementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingsRetirementsService.remove(+id);
  }
}
