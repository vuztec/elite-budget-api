import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Request } from '@nestjs/common';
import { RootusersService } from './rootusers.service';
import { CreateRootuserDto } from './dto/create-rootuser.dto';
import { UpdateRootuserDto, UpdateUserAutoRenewalDto } from './dto/update-rootuser.dto';
import { ApiTags } from '@nestjs/swagger';
import { Rootuser } from './entities/rootuser.entity';

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

  @Patch('renewal')
  updateAutoRenewal(@Request() req: any, @Body() updateUserAutoRenewalDto: UpdateUserAutoRenewalDto) {
    const { user } = req;
    const ipAddress = req.ip || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    return this.rootusersService.updateAutoRenewal(user.id, updateUserAutoRenewalDto, ipAddress, userAgent);
  }

  @Patch(':id/FreeAccess')
  updateFreeAccess(@Param('id') id: string) {
    return this.rootusersService.updateFreeAccess(+id);
  }

  @Patch(':id/Status')
  updateStatus(@Param('id') id: string) {
    return this.rootusersService.updateStatus(+id);
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
