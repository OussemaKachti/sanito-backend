import { Entity, Column, CreateDateColumn, ManyToOne, Index, PrimaryColumn } from 'typeorm';
import { RfidType } from '@common/enums';
import { Location } from '../../locations/entities/location.entity';

@Entity('rfid_scans')
@Index(['rfidId', 'scannedAt'])
@Index(['locationId', 'scannedAt'])
@Index(['scannedAt'])
export class RfidScan {
  @PrimaryColumn('bigint')
  id: number;

  @Column()
  rfidId: string;

  @Column({ type: 'enum', enum: RfidType })
  rfidType: RfidType;

  @Column({ nullable: true })
  locationId: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  signalStrength: number;

  @Column({ nullable: true })
  readerId: string;

  @Column({ nullable: true })
  readerName: string;

  @CreateDateColumn()
  scannedAt: Date;

  // Relations
  @ManyToOne(() => Location, { nullable: true })
  location: Location;
}
