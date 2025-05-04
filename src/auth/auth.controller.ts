import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { ChangePasswordDto, ForgetPasswordDto, UpdateAuthDto, UpdatePasswordDto } from './dto/update-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { RootusersService } from '@/rootusers/rootusers.service';
import { CreateRootuserDto } from '@/rootusers/dto/create-rootuser.dto';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

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

  @Post('forget-password')
  forgetPassword(@Body() createAuthDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('me')
  findMe(@Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.authService.findMe(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch('password')
  updatePassword(@Body() updateUserDto: UpdatePasswordDto, @Req() req: Request & { user: Rootuser }) {
    const { user } = req;
    return this.authService.updatePassword(updateUserDto, user);
  }

  @Patch('reset-password')
  resetPassword(@Body() updateUserDto: ChangePasswordDto) {
    return this.authService.resetPassword(updateUserDto);
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
