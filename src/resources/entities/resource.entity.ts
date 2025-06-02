import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  Path: string;

  @Column({ default: null, nullable: true })
  Name: string;

  @Column({ default: null, nullable: true })
  Type: string;

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
  CreatedBy: Rootuser;

  @ManyToOne(() => Rootuser, (user) => user)
  UpdatedBy: Rootuser;
}
