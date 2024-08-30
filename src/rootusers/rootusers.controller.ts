import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RootusersService } from './rootusers.service';
import { CreateRootuserDto } from './dto/create-rootuser.dto';
import { UpdateRootuserDto } from './dto/update-rootuser.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('rootusers')
@ApiTags('User')
export class RootusersController {
  constructor(private readonly rootusersService: RootusersService) {}

  @Post()
  create(@Body() createRootuserDto: CreateRootuserDto) {
    return this.rootusersService.create(createRootuserDto);
  }

  @Get()
  findAll() {
    return this.rootusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rootusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRootuserDto: UpdateRootuserDto) {
    return this.rootusersService.update(+id, updateRootuserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rootusersService.remove(+id);
  }
}
