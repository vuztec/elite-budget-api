import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { JointSplitService } from './joint-split.service';
import { CreateJointSplitDto } from './dto/create-joint-split.dto';
import { UpdateJointSplitDto } from './dto/update-joint-split.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

@Controller('joint-split')
export class JointSplitController {
  constructor(private readonly jointSplitService: JointSplitService) {}

  @Post()
  create(@Body() createJointSplitDto: CreateJointSplitDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.jointSplitService.create(createJointSplitDto, user);
  }

  @Get()
  findAll() {
    return this.jointSplitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jointSplitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJointSplitDto: UpdateJointSplitDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.jointSplitService.update(+id, updateJointSplitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jointSplitService.remove(+id);
  }
}
