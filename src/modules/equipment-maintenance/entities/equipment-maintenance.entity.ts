import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('equipment_maintenance')
export class EquipmentMaintenance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipmentId: string;

  @Column({ nullable: true })
  maintenanceType: string;

  @Column({ type: 'date', nullable: true })
  scheduledDate: Date;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  technicianId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ default: 'SCHEDULED' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Equipment, (equipment) => equipment.maintenances, { onDelete: 'CASCADE' })
  equipment: Equipment;

  @ManyToOne(() => User, (user) => user.maintenances)
  technician: User;
}
