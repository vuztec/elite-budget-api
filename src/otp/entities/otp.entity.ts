import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Code: string;

  @Column({ nullable: true })
  Email?: string;

  @Column({ type: 'datetime' })
  ExpiresAt: Date;

  @Column({ default: false })
  IsUsed: boolean;

  @CreateDateColumn()
  CreatedAt: Date;
}
