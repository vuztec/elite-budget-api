import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ExtraPayChecksService } from './extra-pay-checks.service';
import { CreateExtraPayCheckDto } from './dto/create-extra-pay-check.dto';
import { UpdateExtraPayCheckDto } from './dto/update-extra-pay-check.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('extra-pay-checks')
@ApiTags('Extra Pay Checks')
export class ExtraPayChecksController {
  constructor(private readonly extraPayChecksService: ExtraPayChecksService) {}

  @Post()
  create(@Body() createExtraPayCheckDto: CreateExtraPayCheckDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.extraPayChecksService.create(createExtraPayCheckDto, user);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.extraPayChecksService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extraPayChecksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExtraPayCheckDto: UpdateExtraPayCheckDto) {
    return this.extraPayChecksService.update(+id, updateExtraPayCheckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extraPayChecksService.remove(+id);
  }
}
