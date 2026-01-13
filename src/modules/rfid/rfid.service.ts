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
}
