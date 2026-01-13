import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

@Entity('vital_signs')
@Index(['patientId', 'measuredAt'])
@Index(['measuredAt'])
export class VitalSign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;

  @Column({ nullable: true })
  heartRate: number;

  @Column({ nullable: true })
  bloodPressure: string;

  @Column({ nullable: true })
  respiratoryRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  oxygenSaturation: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  bloodGlucose: number;

  @Column({ default: () => 'now()' })
  measuredAt: Date;

  @Column({ nullable: true })
  recordedById: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.vitalSigns, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => User, (user) => user.vitalSignsRecorded)
  recordedBy: User;
}
