import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Alert } from '../../alerts/entities/alert.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  recipientUserId: string;

  @Column({ nullable: true })
  recipientEmail: string;

  @Column({ nullable: true })
  recipientPhone: string;

  @Column({ nullable: true })
  notificationType: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true })
  alertId: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  readAt: Date;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ default: 3 })
  maxRetries: number;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  recipientUser: User;

  @ManyToOne(() => Alert, (alert) => alert.notifications, { nullable: true })
  alert: Alert;
}
