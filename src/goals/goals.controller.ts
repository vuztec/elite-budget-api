import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { GOAL_TYPE } from '@/shared/enums/enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('goals')
@ApiTags('Goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(
    @Body() createGoalDto: CreateGoalDto,
    @Req() req: Request & { user: Rootuser },
    @Query('type') type: GOAL_TYPE,
  ) {
    const { user } = req;
    return this.goalsService.create(createGoalDto, user, type);
  }

  @Get()
  findAll(@Req() req: Request & { user: Rootuser }, @Query('type') type: GOAL_TYPE) {
    const { user } = req;
    return this.goalsService.findAll(user, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalsService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalsService.remove(+id);
  }
}
