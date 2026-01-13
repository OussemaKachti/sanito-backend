import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VitalSign } from './entities/vital-sign.entity';

@Injectable()
export class VitalSignsService {
  constructor(
    @InjectRepository(VitalSign)
    private vitalSignRepository: Repository<VitalSign>,
  ) {}

  async create(data: Partial<VitalSign>): Promise<VitalSign> {
    const vital = this.vitalSignRepository.create(data);
    return this.vitalSignRepository.save(vital);
  }

  async findAll(skip = 0, take = 10): Promise<VitalSign[]> {
    return this.vitalSignRepository.find({ skip, take, order: { measuredAt: 'DESC' } });
  }

  async findByPatient(patientId: string, skip = 0, take = 10): Promise<VitalSign[]> {
    return this.vitalSignRepository.find({
      where: { patientId },
      skip,
      take,
      order: { measuredAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<VitalSign> {
    const vital = await this.vitalSignRepository.findOne({ where: { id } });
    if (!vital) throw new NotFoundException('Vital sign not found');
    return vital;
  }

  async getLatest(patientId: string): Promise<VitalSign | null> {
    return this.vitalSignRepository.findOne({
      where: { patientId },
      order: { measuredAt: 'DESC' },
    });
  }

  async getAverages(patientId: string, timeRange: { start: Date; end: Date }): Promise<any> {
    const vitals = await this.vitalSignRepository
      .createQueryBuilder('vital')
      .where('vital.patientId = :patientId', { patientId })
      .andWhere('vital.measuredAt >= :startDate', { startDate: timeRange.start })
      .andWhere('vital.measuredAt <= :endDate', { endDate: timeRange.end })
      .getMany();

    if (vitals.length === 0) return null;

    const avgTemp = vitals.reduce((sum, v) => sum + v.temperature, 0) / vitals.length;
    const avgHeartRate = vitals.reduce((sum, v) => sum + v.heartRate, 0) / vitals.length;
    const avgBloodPressure = vitals.reduce((sum, v) => sum + parseFloat(v.bloodPressure.split('/')[0]), 0) / vitals.length;
    const avgOxygen = vitals.reduce((sum, v) => sum + v.oxygenSaturation, 0) / vitals.length;

    return {
      averageTemperature: avgTemp.toFixed(2),
      averageHeartRate: avgHeartRate.toFixed(0),
      averageBloodPressure: avgBloodPressure.toFixed(0),
      averageOxygenSaturation: avgOxygen.toFixed(2),
      measurementCount: vitals.length,
    };
  }

  async detectAnomalies(patientId: string): Promise<string[]> {
    const latest = await this.getLatest(patientId);
    if (!latest) return [];

    const anomalies: string[] = [];
    
    if (latest.temperature > 39) anomalies.push('High fever (>39°C)');
    if (latest.temperature < 35) anomalies.push('Hypothermia (<35°C)');
    if (latest.heartRate > 120) anomalies.push('Tachycardia (>120 bpm)');
    if (latest.heartRate < 60) anomalies.push('Bradycardia (<60 bpm)');
    if (latest.oxygenSaturation < 90) anomalies.push('Low oxygen saturation (<90%)');

    return anomalies;
  }

  async getByDateRange(patientId: string, startDate: Date, endDate: Date, skip = 0, take = 10): Promise<VitalSign[]> {
    return this.vitalSignRepository
      .createQueryBuilder('vital')
      .where('vital.patientId = :patientId', { patientId })
      .andWhere('vital.measuredAt >= :startDate', { startDate })
      .andWhere('vital.measuredAt <= :endDate', { endDate })
      .orderBy('vital.measuredAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
