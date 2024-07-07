import { Injectable } from '@nestjs/common';
import { CreateRootuserDto } from './dto/create-rootuser.dto';
import { UpdateRootuserDto } from './dto/update-rootuser.dto';

@Injectable()
export class RootusersService {
  create(createRootuserDto: CreateRootuserDto) {
    return 'This action adds a new rootuser';
  }

  findAll() {
    return `This action returns all rootusers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rootuser`;
  }

  update(id: number, updateRootuserDto: UpdateRootuserDto) {
    return `This action updates a #${id} rootuser`;
  }

  remove(id: number) {
    return `This action removes a #${id} rootuser`;
  }
}
