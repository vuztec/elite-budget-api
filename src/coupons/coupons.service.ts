import { Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

@Injectable()
export class CouponsService {
  constructor(@InjectRepository(Coupon) private readonly couponsRepo: Repository<Coupon>) {}

  async create(createCouponDto: CreateCouponDto) {
    const new_coupon = new Coupon();

    if (createCouponDto.Code) new_coupon.Code = createCouponDto.Code;
    else {
      let Code: string;
      do {
        Code = this.generateGroupCode();
      } while (await this.couponsRepo.findOne({ where: { Code } }));

      new_coupon.Code = Code;
    }

    new_coupon.Description = createCouponDto.Description;
    new_coupon.Percentage = createCouponDto.Percentage;

    new_coupon.CreatedAt = new Date();

    return this.couponsRepo.save(new_coupon);
  }

  // Helper function to generate an 8-character alphanumeric code
  generateGroupCode(): string {
    return randomBytes(4).toString('hex'); // 8 characters (4 bytes = 8 hex digits)
  }

  findAll() {
    return this.couponsRepo.createQueryBuilder('coupon').orderBy('coupon.CreatedAt', 'DESC').getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const new_coupon = await this.couponsRepo.findOne({ where: { id } });

    if (updateCouponDto.Code) new_coupon.Code = updateCouponDto.Code;
    else {
      let Code: string;
      do {
        Code = this.generateGroupCode();
      } while (await this.couponsRepo.findOne({ where: { Code } }));

      new_coupon.Code = Code;
    }

    new_coupon.Description = updateCouponDto.Description;
    new_coupon.Percentage = updateCouponDto.Percentage;

    new_coupon.UpdatedAt = new Date();

    return this.couponsRepo.save(new_coupon);
  }

  remove(id: number) {
    return `This action removes a #${id} coupon`;
  }
}
