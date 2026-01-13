import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private medicalRecordRepository: Repository<MedicalRecord>,
  ) {}

  async create(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const record = this.medicalRecordRepository.create(data);
    return this.medicalRecordRepository.save(record);
  }

  async findAll(skip = 0, take = 10): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({ skip, take });
  }

  async findByPatient(patientId: string, skip = 0, take = 10): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: { patientId },
      skip,
      take,
    });
  }

  async findOne(id: string): Promise<MedicalRecord | null> {
    return this.medicalRecordRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.medicalRecordRepository.delete(id);
  }

  async findByType(type: string, skip = 0, take = 10): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: { recordType: type as any },
      skip,
      take,
      order: { recordedAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date, skip = 0, take = 10): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository
      .createQueryBuilder('record')
      .where('record.recordedAt >= :startDate', { startDate })
      .andWhere('record.recordedAt <= :endDate', { endDate })
      .skip(skip)
      .take(take)
      .orderBy('record.recordedAt', 'DESC')
      .getMany();
  }

  async uploadDocument(patientId: string, file: any, recordType: string): Promise<MedicalRecord> {
    // TODO: Integrate with file storage (AWS S3, Azure Blob, etc.)
    const record = this.medicalRecordRepository.create({
      patientId,
      recordType,
      title: file.originalname,
      fileUrl: `/uploads/records/${file.filename}`,
      recordedAt: new Date(),
    } as any);
    const saved = await this.medicalRecordRepository.save(record);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async getRecordsByType(patientId: string, type: string, skip = 0, take = 10): Promise<MedicalRecord[]> {
    return this.medicalRecordRepository.find({
      where: { patientId, recordType: type as any },
      skip,
      take,
      order: { recordedAt: 'DESC' },
    });
  }
}
