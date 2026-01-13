import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
  ) {}

  async create(data: Partial<Equipment>): Promise<Equipment> {
    const equipment = this.equipmentRepository.create(data);
    return this.equipmentRepository.save(equipment);
  }

  async findAll(skip = 0, take = 10): Promise<Equipment[]> {
    return this.equipmentRepository.find({ skip, take });
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({ where: { id } });
    if (!equipment) throw new NotFoundException('Equipment not found');
    return equipment;
  }

  async update(id: string, data: Partial<Equipment>): Promise<Equipment> {
    await this.findOne(id);
    await this.equipmentRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.equipmentRepository.delete(id);
  }
}
