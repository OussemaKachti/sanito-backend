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

  async getAlertsByType(type: string, skip = 0, take = 10): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { alertType: type as any },
      skip,
      take,
      order: { triggeredAt: 'DESC' },
    });
  }

  async getAlertsBySeverity(severity: AlertSeverity, skip = 0, take = 10): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { severity: severity as any },
      skip,
      take,
      order: { triggeredAt: 'DESC' },
    });
  }

  async getAlertsByStatus(status: AlertStatus, skip = 0, take = 10): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { status: status as any },
      skip,
      take,
      order: { triggeredAt: 'DESC' },
    });
  }

  async createAlertRule(data: any): Promise<any> {
    // TODO: Create AlertRule entity and repository
    return {
      id: 'rule-' + Date.now(),
      ...data,
      createdAt: new Date(),
    };
  }

  async updateAlertRule(ruleId: string, data: any): Promise<any> {
    // TODO: Update AlertRule entity
    return {
      id: ruleId,
      ...data,
      updatedAt: new Date(),
    };
  }

  async deleteAlertRule(ruleId: string): Promise<void> {
    // TODO: Delete AlertRule entity
    console.log(`Alert rule ${ruleId} deleted`);
  }

  async triggerAlert(type: string, severity: string, relatedData: any): Promise<Alert> {
    const alert = this.alertRepository.create({
      alertType: type as any,
      severity: severity as any,
      status: AlertStatus.OPEN,
      triggeredAt: new Date(),
      details: relatedData,
    } as any);
    const saved = await this.alertRepository.save(alert);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async getAlertsByPatient(patientId: string, skip = 0, take = 10): Promise<Alert[]> {
    return this.alertRepository.find({
      where: { patientId: patientId as any },
      skip,
      take,
      order: { triggeredAt: 'DESC' },
    });
  }
}
