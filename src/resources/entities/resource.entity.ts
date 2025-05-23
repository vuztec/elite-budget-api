import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Resource extends CustomBaseEntity {
  @Column({ default: null, nullable: true })
  Path: string;

  @Column({ default: null, nullable: true })
  Name: string;
}
