import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  async create(data: Partial<Prescription>): Promise<Prescription> {
    const prescription = this.prescriptionRepository.create(data);
    return this.prescriptionRepository.save(prescription);
  }

  async findAll(skip = 0, take = 10): Promise<Prescription[]> {
    return this.prescriptionRepository.find({ skip, take });
  }

  async findOne(id: string): Promise<Prescription | null> {
    return this.prescriptionRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Prescription>): Promise<Prescription | null> {
    await this.prescriptionRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.prescriptionRepository.delete(id);
  }
}
