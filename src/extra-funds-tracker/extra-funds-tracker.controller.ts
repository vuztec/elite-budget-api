import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ExtraFundsTrackerService } from './extra-funds-tracker.service';
import { CreateExtraFundsTrackerDto } from './dto/create-extra-funds-tracker.dto';
import { UpdateBalanceDto, UpdateExtraFundsTrackerDto } from './dto/update-extra-funds-tracker.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('extra-funds-tracker')
@ApiTags('Extra Funds Tracker')
export class ExtraFundsTrackerController {
  constructor(private readonly extraFundsTrackerService: ExtraFundsTrackerService) {}

  @Post()
  create(@Body() createExtraFundsTrackerDto: CreateExtraFundsTrackerDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.extraFundsTrackerService.create(createExtraFundsTrackerDto, user);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.extraFundsTrackerService.findAll(user);
  }

  @Get('excess-balance')
  findBalance(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.extraFundsTrackerService.findBalance(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extraFundsTrackerService.findOne(+id);
  }

  @Patch('excess-balance')
  updateBalance(@Body() updateBalanceDto: UpdateBalanceDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.extraFundsTrackerService.updateBalance(updateBalanceDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExtraFundsTrackerDto: UpdateExtraFundsTrackerDto,
    @Req() req: Request & { user: Rootuser },
  ) {
    const { user } = req;
    return this.extraFundsTrackerService.update(+id, updateExtraFundsTrackerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extraFundsTrackerService.remove(+id);
  }
}
