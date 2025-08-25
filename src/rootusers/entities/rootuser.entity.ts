import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { PACKAGE, PLAN, Status, UserType } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Rootuser extends CustomBaseEntity {
  @ApiProperty()
  @Column()
  FullName: string;

  @ApiProperty()
  @Index()
  @Column()
  @IsEmail()
  Email: string;

  @Column({ default: null, nullable: true })
  @ApiProperty()
  StripeId: string;

  @ApiProperty()
  @Column({ length: 255 })
  Contact: string;

  @ApiProperty()
  @Column()
  PartnerAge: number;

  @ApiProperty()
  @Column()
  SelfAge: number;

  @ApiProperty()
  @Column()
  @Length(8, 32)
  Password: string;

  @Column()
  @ApiProperty()
  Separator: string;

  @Column()
  @ApiProperty()
  Country: string;

  @Column({ nullable: true })
  @ApiProperty()
  Province: string;

  @Column({ nullable: true })
  @ApiProperty()
  City: string;

  @Column({ nullable: true })
  @ApiProperty()
  Address: string;

  @Column({ default: '$' })
  @ApiProperty()
  Currency: string;

  @Column({ default: 'yyyy-MM-dd' })
  @ApiProperty()
  DateFormat: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  Status: Status;

  @Column({ type: 'enum', enum: UserType, default: UserType.ROOT })
  UserType: UserType;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  IsGoogle: boolean;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  Auto_Renewal: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  FreeAccess: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  Payment: boolean;

  @Column({ type: 'boolean', default: true })
  @ApiProperty()
  IsExpired: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  IsAdmin: boolean;

  @Column({ type: 'enum', enum: PACKAGE, default: PACKAGE.PREMIUM })
  @ApiProperty()
  Package: PACKAGE;

  @Column({ type: 'enum', enum: PLAN, default: PLAN.YEARLY })
  @ApiProperty()
  Plan: PLAN;

  @Column({
    type: 'datetime',
    nullable: true,
    default: null,
  })
  @ApiProperty()
  SubscribeDate: Date;

  @Column({ nullable: true, default: null })
  @ApiProperty()
  Coupon: string;
}
