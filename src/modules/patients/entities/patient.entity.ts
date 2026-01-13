import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { PatientStatus } from '@common/enums';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { VitalSign } from '../../vital-signs/entities/vital-sign.entity';
import { PatientPositionHistory } from '../../patient-position-history/entities/patient-position-history.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';

@Entity('patients')
@Index(['rfidBadgeId'])
@Index(['status'])
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  rfidBadgeId: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  bloodType: string;

  @CreateDateColumn()
  admissionDate: Date;

  @Column({ nullable: true })
  dischargeDate: Date;

  @Column({ nullable: true })
  roomId: string;

  @Column({ nullable: true })
  attendingDoctorId: string;

  @Column({ type: 'text', nullable: true })
  medicalNotes: string;

  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ type: 'text', nullable: true })
  currentMedications: string;

  @Column({ type: 'enum', enum: PatientStatus, default: PatientStatus.ACTIVE })
  status: PatientStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Location, (location) => location.patients)
  room: Location;

  @ManyToOne(() => User, (user) => user.patients)
  attendingDoctor: User;

  @OneToMany(() => VitalSign, (vitalSign) => vitalSign.patient)
  vitalSigns: VitalSign[];

  @OneToMany(() => PatientPositionHistory, (history) => history.patient)
  positionHistory: PatientPositionHistory[];

  @OneToMany(() => Prescription, (prescription) => prescription.patient)
  prescriptions: Prescription[];

  @OneToMany(() => MedicalRecord, (record) => record.patient)
  medicalRecords: MedicalRecord[];
}
