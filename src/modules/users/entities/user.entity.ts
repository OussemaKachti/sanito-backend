import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { Role } from '@common/enums';
import { Patient } from '../../patients/entities/patient.entity';
import { VitalSign } from '../../vital-signs/entities/vital-sign.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { ActivityLog } from '../../activity-log/entities/activity-log.entity';
import { EquipmentMaintenance } from '../../equipment-maintenance/entities/equipment-maintenance.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';

@Entity('users')
@Index(['email'])
@Index(['role'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.STAFF })
  role: Role;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ nullable: true })
  twoFactorSecret: string;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Patient, (patient) => patient.attendingDoctor)
  patients: Patient[];

  @OneToMany(() => VitalSign, (vitalSign) => vitalSign.recordedBy)
  vitalSignsRecorded: VitalSign[];

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @OneToMany(() => ActivityLog, (log) => log.user)
  activityLogs: ActivityLog[];

  @OneToMany(() => EquipmentMaintenance, (maintenance) => maintenance.technician)
  maintenances: EquipmentMaintenance[];

  @OneToMany(() => Prescription, (prescription) => prescription.prescribedBy)
  prescriptions: Prescription[];

  @OneToMany(() => MedicalRecord, (record) => record.recordedBy)
  medicalRecords: MedicalRecord[];
}
