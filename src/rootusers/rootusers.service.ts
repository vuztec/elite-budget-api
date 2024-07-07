import { Injectable } from '@nestjs/common';
import { CreateRootuserDto } from './dto/create-rootuser.dto';
import { UpdateRootuserDto } from './dto/update-rootuser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Rootuser } from './entities/rootuser.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RootusersService {
  constructor(@InjectRepository(Rootuser) private readonly rootuserRepo: Repository<Rootuser>) {}

  async create(createRootuserDto: CreateRootuserDto) {
    const new_user = new Rootuser();

    new_user.FullName = createRootuserDto.FullName;
    new_user.Email = createRootuserDto.Email;
    new_user.Contact = createRootuserDto.Contact;
    new_user.Address = createRootuserDto.Address;
    new_user.City = createRootuserDto.City;
    new_user.Country = createRootuserDto.Country;
    new_user.DateFormat = createRootuserDto.DateFormat;
    new_user.Province = createRootuserDto.Province;
    new_user.Currency = createRootuserDto.Currency;
    new_user.Separator = createRootuserDto.Separator;

    new_user.Password = await bcrypt.hash(createRootuserDto.Password, Number(process.env.SALT));

    const user = await this.rootuserRepo.save(new_user);

    return user;
  }

  findAll() {
    return this.rootuserRepo.find({});
  }

  findOne(id: number) {
    return this.rootuserRepo.findOneBy({ id });
  }

  async update(id: number, updateRootuserDto: UpdateRootuserDto) {
    const new_user = await this.findOne(id);

    new_user.FullName = updateRootuserDto.FullName;
    new_user.Contact = updateRootuserDto.Contact;
    new_user.Address = updateRootuserDto.Address;
    new_user.City = updateRootuserDto.City;
    new_user.Country = updateRootuserDto.Country;
    new_user.DateFormat = updateRootuserDto.DateFormat;
    new_user.Province = updateRootuserDto.Province;
    new_user.Currency = updateRootuserDto.Currency;
    new_user.Separator = updateRootuserDto.Separator;

    return await this.rootuserRepo.save(new_user);
  }

  remove(id: number) {
    return this.rootuserRepo.delete(id);
  }
}
