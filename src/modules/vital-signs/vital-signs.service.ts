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
}
