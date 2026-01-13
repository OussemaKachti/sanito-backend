import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column()
  recordType: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  documentUrl: string;

  @Column()
  recordedById: string;

  @Column()
  recordedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.medicalRecords, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => User, (user) => user.medicalRecords)
  recordedBy: User;
}
