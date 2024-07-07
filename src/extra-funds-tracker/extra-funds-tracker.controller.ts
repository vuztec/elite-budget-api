import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';
import { CreateExtraFundsTrackerDto } from './dto/create-extra-funds-tracker.dto';
import { UpdateExtraFundsTrackerDto } from './dto/update-extra-funds-tracker.dto';

@Controller('extra-funds-tracker')
export class ExtraFundsTrackerController {
  constructor(private readonly extraFundsTrackerService: ExtraFundsTrackerService) {}

  @Post()
  create(@Body() createExtraFundsTrackerDto: CreateExtraFundsTrackerDto) {
    return this.extraFundsTrackerService.create(createExtraFundsTrackerDto);
  }

  @Get()
  findAll() {
    return this.extraFundsTrackerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extraFundsTrackerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExtraFundsTrackerDto: UpdateExtraFundsTrackerDto) {
    return this.extraFundsTrackerService.update(+id, updateExtraFundsTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extraFundsTrackerService.remove(+id);
  }
}
