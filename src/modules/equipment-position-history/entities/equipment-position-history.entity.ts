import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { Equipment } from '../../equipment/entities/equipment.entity';
import { Location } from '../../locations/entities/location.entity';
import { User } from '../../users/entities/user.entity';

@Entity('equipment_position_history')
@Index(['equipmentId', 'movedAt'])
@Index(['movedAt'])
export class EquipmentPositionHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipmentId: string;

  @Column({ nullable: true })
  locationId: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @CreateDateColumn()
  movedAt: Date;

  @Column({ nullable: true })
  movedById: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Relations
  @ManyToOne(() => Equipment, (equipment) => equipment.positionHistory, { onDelete: 'CASCADE' })
  equipment: Equipment;

  @ManyToOne(() => Location, { nullable: true })
  location: Location;

  @ManyToOne(() => User)
  movedBy: User;
}
