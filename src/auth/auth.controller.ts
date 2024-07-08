import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RootusersService } from '@/rootusers/rootusers.service';
import { CreateRootuserDto } from '@/rootusers/dto/create-rootuser.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rootusersService: RootusersService,
  ) {}

  @Post('login')
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Post('signup')
  signup(@Body() createAuthDto: CreateRootuserDto) {
    return this.rootusersService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
