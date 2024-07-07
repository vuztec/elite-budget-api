import { CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

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

  @ManyToOne(() => Rootuser, (user) => user)
  @ApiProperty()
  Root: Rootuser;
}
