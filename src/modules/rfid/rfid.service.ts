import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RfidScan } from './entities/rfid-scan.entity';

@Injectable()
export class RfidService {
  constructor(
    @InjectRepository(RfidScan)
    private rfidScanRepository: Repository<RfidScan>,
  ) {}

  async processScan(data: Partial<RfidScan>): Promise<RfidScan> {
    const scan = this.rfidScanRepository.create(data);
    return this.rfidScanRepository.save(scan);
  }

  async findAllScans(skip = 0, take = 1000): Promise<RfidScan[]> {
    return this.rfidScanRepository.find({
      skip,
      take,
      order: { scannedAt: 'DESC' },
    });
  }

  async findByRfidId(rfidId: string, skip = 0, take = 100): Promise<RfidScan[]> {
    return this.rfidScanRepository.find({
      where: { rfidId },
      skip,
      take,
      order: { scannedAt: 'DESC' },
    });
  }

  async getCurrentLocation(rfidId: string): Promise<RfidScan | null> {
    return this.rfidScanRepository.findOne({
      where: { rfidId },
      order: { scannedAt: 'DESC' },
    });
  }

  async deduplicate(): Promise<number> {
    // Remove duplicate scans within 5 seconds
    const scans = await this.rfidScanRepository.find({
      order: { scannedAt: 'ASC' },
    });

    let deletedCount = 0;
    for (let i = 1; i < scans.length; i++) {
      const timeDiff = scans[i].scannedAt.getTime() - scans[i - 1].scannedAt.getTime();
      if (timeDiff < 5000 && scans[i].rfidId === scans[i - 1].rfidId && scans[i].locationId === scans[i - 1].locationId) {
        await this.rfidScanRepository.delete(scans[i].id);
        deletedCount++;
      }
    }
    return deletedCount;
  }

  async validateRfidData(data: any): Promise<boolean> {
    return !!(data.rfidId && data.locationId && data.scannedAt);
  }

  async parseHopelandData(rawData: string): Promise<any> {
    // TODO: Parse Hopeland specific RFID format
    // Example: "HOPELAND:RFID_ID:LOCATION:STRENGTH:TIMESTAMP"
    const parts = rawData.split(':');
    return {
      rfidId: parts[1],
      locationId: parts[2],
      signalStrength: parseInt(parts[3], 10),
      scannedAt: new Date(parseInt(parts[4], 10)),
    };
  }

  async assignPatientBracelet(patientId: string, rfidBadgeId: string): Promise<any> {
    // TODO: Link patient to RFID badge in database
    return {
      patientId,
      rfidBadgeId,
      assignedAt: new Date(),
      message: 'Patient bracelet assigned successfully',
    };
  }

  async assignEquipmentTag(equipmentId: string, rfidTagId: string): Promise<any> {
    // TODO: Link equipment to RFID tag in database
    return {
      equipmentId,
      rfidTagId,
      assignedAt: new Date(),
      message: 'Equipment tag assigned successfully',
    };
  }

  async getMovementHistory(rfidId: string, startDate: Date, endDate: Date, skip = 0, take = 100): Promise<RfidScan[]> {
    return this.rfidScanRepository
      .createQueryBuilder('scan')
      .where('scan.rfidId = :rfidId', { rfidId })
      .andWhere('scan.scannedAt >= :startDate', { startDate })
      .andWhere('scan.scannedAt <= :endDate', { endDate })
      .orderBy('scan.scannedAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async detectUnauthorizedZone(rfidId: string, locationId: string): Promise<boolean> {
    // TODO: Check against restricted zones configuration
    const scan = await this.rfidScanRepository.findOne({
      where: { rfidId, locationId },
    });
    return !!scan; // If found, it's in that zone
  }

  async getSignalStrengthTrend(rfidId: string): Promise<any[]> {
    const scans = await this.rfidScanRepository.find({
      where: { rfidId },
      order: { scannedAt: 'DESC' },
      take: 20,
    });

    return scans.map((scan) => ({
      timestamp: scan.scannedAt,
      signalStrength: scan.signalStrength,
      location: scan.locationId,
    }));
  }
}
