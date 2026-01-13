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

  async findByPatient(patientId: string, skip = 0, take = 10): Promise<Prescription[]> {
    return this.prescriptionRepository.find({
      where: { patientId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: string, skip = 0, take = 10): Promise<Prescription[]> {
    return this.prescriptionRepository.find({
      where: { status },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(skip = 0, take = 10): Promise<Prescription[]> {
    const now = new Date();
    return this.prescriptionRepository
      .createQueryBuilder('prescription')
      .where('prescription.status = :status', { status: 'ACTIVE' })
      .andWhere('prescription.startDate <= :now', { now })
      .andWhere('prescription.endDate > :now', { now })
      .skip(skip)
      .take(take)
      .getMany();
  }

  async updateStatus(prescriptionId: string, newStatus: string): Promise<Prescription | null> {
    await this.prescriptionRepository.update(prescriptionId, { status: newStatus });
    return this.findOne(prescriptionId);
  }
}
