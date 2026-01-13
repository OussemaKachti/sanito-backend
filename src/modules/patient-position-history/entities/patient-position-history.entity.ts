import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('patient_position_history')
@Index(['patientId', 'enteredAt'])
@Index(['enteredAt'])
export class PatientPositionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @Column({ nullable: true })
  locationId: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  enteredAt: Date;

  @Column({ nullable: true })
  exitedAt: Date;

  @Column({ nullable: true })
  durationSeconds: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Patient, (patient) => patient.positionHistory, { onDelete: 'CASCADE' })
  patient: Patient;

  @ManyToOne(() => Location, { nullable: true })
  location: Location;
}
