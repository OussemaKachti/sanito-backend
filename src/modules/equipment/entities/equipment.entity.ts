import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index } from 'typeorm';
import { EquipmentStatus } from '@common/enums';
import { Location } from '../../locations/entities/location.entity';
import { EquipmentPositionHistory } from '../../equipment-position-history/entities/equipment-position-history.entity';
import { EquipmentMaintenance } from '../../equipment-maintenance/entities/equipment-maintenance.entity';

@Entity('equipment')
@Index(['rfidTagId'])
@Index(['status'])
@Index(['currentLocationId'])
export class Equipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  rfidTagId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  manufacturer: string;

  @Column({ unique: true, nullable: true })
  serialNumber: string;

  @Column({ nullable: true })
  equipmentType: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true })
  warrantyUntil: Date;

  @Column({ nullable: true })
  currentLocationId: string;

  @Column({ type: 'enum', enum: EquipmentStatus, default: EquipmentStatus.AVAILABLE })
  status: EquipmentStatus;

  @Column({ nullable: true })
  lastMaintenanceDate: Date;

  @Column({ nullable: true })
  nextMaintenanceDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost: number;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Location, (location) => location.equipment)
  currentLocation: Location;

  @OneToMany(() => EquipmentPositionHistory, (history) => history.equipment)
  positionHistory: EquipmentPositionHistory[];

  @OneToMany(() => EquipmentMaintenance, (maintenance) => maintenance.equipment)
  maintenances: EquipmentMaintenance[];
}
