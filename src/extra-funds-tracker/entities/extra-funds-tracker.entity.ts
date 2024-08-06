import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';
import { Owner, TRANSACTION_TYPE } from '@/shared/enums/enum';
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

@Entity()
export class ExtraFundsTracker extends CustomBaseEntity {
  @Column({ type: 'enum', enum: Owner, default: null })
  Owner: Owner;

  @Column()
  @ApiProperty()
  Description: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  Date: Date;

  @Column({ type: 'enum', enum: TRANSACTION_TYPE, default: TRANSACTION_TYPE.CREDIT })
  Type: TRANSACTION_TYPE;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty()
  Amount: Number;
}
