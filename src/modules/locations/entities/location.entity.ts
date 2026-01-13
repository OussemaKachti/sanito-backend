import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { LocationType } from '@common/enums';
import { Patient } from '../../patients/entities/patient.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity('locations')
@Index(['type'])
@Index(['latitude', 'longitude'])
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: LocationType })
  type: LocationType;

  @Column({ nullable: true })
  floor: number;

  @Column({ nullable: true })
  ward: string;

  @Column({ nullable: true })
  capacity: number;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ default: false })
  isRestricted: boolean;

  @Column({ default: 0 })
  readersCount: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Patient, (patient) => patient.room)
  patients: Patient[];

  @OneToMany(() => Equipment, (equipment) => equipment.currentLocation)
  equipment: Equipment[];
}
