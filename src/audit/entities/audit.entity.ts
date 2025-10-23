import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';

export enum AuditAction {
  AUTO_RENEWAL_ENABLED = 'Auto Renewal Enabled',
  AUTO_RENEWAL_DISABLED = 'Auto Renewal Disabled',
}

@Entity('audit')
export class Audit extends CustomBaseEntity {
  @ApiProperty()
  @Column({ type: 'enum', enum: AuditAction })
  Action: AuditAction;

  @ApiProperty()
  @Column({ type: 'boolean' })
  AutoRenewalStatus: boolean;

  @ApiProperty()
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  ActionDate: Date;

  @ApiProperty()
  @Column({ type: 'varchar', length: 45, nullable: true })
  IpAddress: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  UserAgent: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  Notes: string;

  @ManyToOne(() => Rootuser, { eager: true })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty()
  User: Rootuser;
}
