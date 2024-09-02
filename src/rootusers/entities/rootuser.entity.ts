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

  @Column({ unique: true })
  @Index()
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

  @Column()
  @ApiProperty()
  Province: string;

  @Column()
  @ApiProperty()
  City: string;

  @Column()
  @ApiProperty()
  Address: string;

  @Column()
  @ApiProperty()
  Currency: string;

  @Column()
  @ApiProperty()
  DateFormat: string;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  Status: Status;

  @Column({ type: 'enum', enum: UserType, default: UserType.ROOT })
  UserType: UserType;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  IsGoogle: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  Auto_Renewal: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  Payment: boolean;

  @Column({ type: 'boolean', default: false })
  @ApiProperty()
  IsExpired: boolean;

  @Column({ type: 'enum', enum: PACKAGE })
  @ApiProperty()
  Package: PACKAGE;

  @Column({ type: 'enum', enum: PLAN })
  @ApiProperty()
  Plan: PLAN;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  SubscribeDate: Date;
}
