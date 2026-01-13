import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { AlertType, AlertSeverity } from '@common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('alert_rules')
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: AlertType, nullable: true })
  alertType: AlertType;

  @Column({ type: 'jsonb' })
  ruleJson: Record<string, any>;

  @Column({ type: 'enum', enum: AlertSeverity })
  severity: AlertSeverity;

  @Column({ default: true })
  enabled: boolean;

  @Column({ type: 'jsonb' })
  notifyUsers: string[];

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  createdBy: User;
}
