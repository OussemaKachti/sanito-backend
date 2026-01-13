import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { AlertStatus } from '@common/enums/alert-status.enum';
import { AlertSeverity } from '@common/enums/alert-severity.enum';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
  ) {}

  async create(data: Partial<Alert>): Promise<Alert> {
    const alert = this.alertRepository.create(data);
    return this.alertRepository.save(alert);
  }

  async findAll(skip = 0, take = 10): Promise<Alert[]> {
    return this.alertRepository.find({
      skip,
      take,
      order: { triggeredAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({ where: { id } });
    if (!alert) throw new NotFoundException('Alert not found');
    return alert;
  }

  async acknowledge(id: string, userId: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.acknowledgedAt = new Date();
    alert.acknowledgedById = userId;
    alert.status = AlertStatus.ACKNOWLEDGED;
    return this.alertRepository.save(alert);
  }

  async resolve(id: string, userId: string, notes?: string): Promise<Alert> {
    const alert = await this.findOne(id);
    alert.resolvedAt = new Date();
    alert.resolvedById = userId;
    if (notes) {
      alert.resolutionNotes = notes;
    }
    alert.status = AlertStatus.RESOLVED;
    return this.alertRepository.save(alert);
  }

  async getStats(): Promise<any> {
    const total = await this.alertRepository.count();
    const open = await this.alertRepository.count({ where: { status: AlertStatus.OPEN } });
    const critical = await this.alertRepository.count({ where: { severity: AlertSeverity.CRITICAL } });
    return { total, open, critical };
  }
}
