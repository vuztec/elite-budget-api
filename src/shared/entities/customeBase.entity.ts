import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
// import { User } from '@/users/entities/user.entity';

export abstract class CustomBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @ApiHideProperty()
  CreatedAt: Date;

  @UpdateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Exclude()
  @ApiHideProperty()
  UpdatedAt: Date;
}
