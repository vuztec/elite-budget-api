import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Rootuser } from '@/rootusers/entities/rootuser.entity';
import { CustomBaseEntity } from '@/shared/entities/customeBase.entity';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  CANCELED = 'canceled',
}

export enum PaymentType {
  SUBSCRIPTION = 'subscription',
  INVOICE = 'invoice',
  ONE_TIME = 'one_time',
}

@Entity('payment_transactions')
export class PaymentTransaction extends CustomBaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  StripePaymentId: string; // Payment Intent ID or Invoice ID

  @Column({ type: 'varchar', length: 50, nullable: true })
  InvoiceNo: string; // Generated invoice number (e.g., ECFP-INV-4235)

  @Column({ type: 'varchar', length: 255, nullable: true })
  StripeChargeId: string; // Charge ID if available

  @Column({ type: 'varchar', length: 255, nullable: true })
  StripeInvoiceId: string; // Invoice ID if from invoice

  @ManyToOne(() => Rootuser, { onDelete: 'CASCADE' })
  User: Rootuser;

  @Column({ type: 'varchar', length: 100 })
  CustomerEmail: string;

  @Column({ type: 'enum', enum: PaymentType })
  PaymentType: PaymentType;

  @Column({ type: 'enum', enum: PaymentStatus })
  Status: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  Amount: number; // Amount in dollars

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  OriginalAmount: number; // Original amount before discount

  @Column({ type: 'varchar', length: 10 })
  Currency: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CouponCode: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  DiscountType: string; // 'fixed' or 'percentage'

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  DiscountValue: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  PaymentMethod: string; // e.g., 'card', 'ach_debit'

  @Column({ type: 'varchar', length: 50, nullable: true })
  CardBrand: string; // e.g., 'visa', 'mastercard'

  @Column({ type: 'varchar', length: 4, nullable: true })
  CardLast4: string;

  @Column({ type: 'text', nullable: true })
  BillingAddress: string; // JSON string of billing address

  @Column({ type: 'text', nullable: true })
  StripeMetadata: string; // JSON string of Stripe metadata

  @Column({ type: 'varchar', length: 100, nullable: true })
  FailureReason: string; // Reason if payment failed

  @Column({ type: 'datetime', nullable: true })
  RefundedAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  RefundAmount: number;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ type: 'text', nullable: true })
  Notes: string; // Additional notes

  @Column({ type: 'boolean', default: false })
  EmailSent: boolean; // Track if customer email was sent

  @Column({ type: 'boolean', default: false })
  AdminNotified: boolean; // Track if admin was notified
}

export class Payment {}
