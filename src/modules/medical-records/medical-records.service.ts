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
}
