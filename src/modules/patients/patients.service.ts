import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientStatus } from '@common/enums/patient-status.enum';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async create(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(data);
    return this.patientRepository.save(patient);
  }

  async findAll(skip = 0, take = 10): Promise<Patient[]> {
    return this.patientRepository.find({ skip, take });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async update(id: string, data: Partial<Patient>): Promise<Patient> {
    await this.findOne(id);
    await this.patientRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.patientRepository.delete(id);
  }

  async search(query: string, skip = 0, take = 10): Promise<Patient[]> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.firstName ILIKE :query', { query: `%${query}%` })
      .orWhere('patient.lastName ILIKE :query', { query: `%${query}%` })
      .orWhere('patient.email ILIKE :query', { query: `%${query}%` })
      .orWhere('patient.rfidBadgeId ILIKE :query', { query: `%${query}%` })
      .skip(skip)
      .take(take)
      .getMany();
  }

  async filterByStatus(status: PatientStatus, skip = 0, take = 10): Promise<Patient[]> {
    return this.patientRepository.find({
      where: { status: status as any },
      skip,
      take,
    });
  }

  async filterByDateRange(startDate: Date, endDate: Date, skip = 0, take = 10): Promise<Patient[]> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.admissionDate >= :startDate', { startDate })
      .andWhere('patient.admissionDate <= :endDate', { endDate })
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getPositionHistory(patientId: string, skip = 0, take = 10): Promise<any[]> {
    // Join with PatientPositionHistory table
    return this.patientRepository
      .createQueryBuilder('patient')
      .innerJoinAndSelect(
        'patient.positionHistory',
        'history',
        'history.patientId = patient.id'
      )
      .where('patient.id = :patientId', { patientId })
      .orderBy('history.timestamp', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getVitalSignsHistory(patientId: string, dateRange?: { start: Date; end: Date }, skip = 0, take = 10): Promise<any[]> {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .innerJoinAndSelect('patient.vitalSigns', 'vital', 'vital.patientId = patient.id')
      .where('patient.id = :patientId', { patientId });

    if (dateRange) {
      query.andWhere('vital.timestamp >= :startDate', { startDate: dateRange.start });
      query.andWhere('vital.timestamp <= :endDate', { endDate: dateRange.end });
    }

    return query
      .orderBy('vital.timestamp', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async discharge(patientId: string, notes: string): Promise<Patient> {
    const patient = await this.findOne(patientId);
    patient.status = PatientStatus.DISCHARGED;
    patient.dischargeDate = new Date();
    return this.patientRepository.save(patient);
  }

  async admit(data: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create({
      ...data,
      status: PatientStatus.ACTIVE,
      admissionDate: new Date(),
    } as any);
    const saved = await this.patientRepository.save(patient);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async getStats(): Promise<any> {
    const total = await this.patientRepository.count();
    const active = await this.patientRepository.count({ where: { status: PatientStatus.ACTIVE as any } });
    const discharged = await this.patientRepository.count({ where: { status: PatientStatus.DISCHARGED as any } });
    const transferred = await this.patientRepository.count({ where: { status: PatientStatus.TRANSFERRED as any } });

    return {
      total,
      active,
      discharged,
      transferred,
      activePercentage: ((active / total) * 100).toFixed(2),
    };
  }

  async checkUnauthorizedZone(patientId: string): Promise<boolean> {
    const patient = await this.findOne(patientId);
    // TODO: Check against restricted zones configuration
    // For now, return false (not in unauthorized zone)
    return false;
  }

  async getPatientWithRelations(patientId: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['assignedDoctor', 'location', 'vitalSigns', 'prescriptions', 'medicalRecords'],
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }
}
