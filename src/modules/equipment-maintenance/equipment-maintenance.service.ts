import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentMaintenance } from './entities/equipment-maintenance.entity';

@Injectable()
export class EquipmentMaintenanceService {
  constructor(
    @InjectRepository(EquipmentMaintenance)
    private maintenanceRepository: Repository<EquipmentMaintenance>,
  ) {}

  async create(data: Partial<EquipmentMaintenance>): Promise<EquipmentMaintenance> {
    const maintenance = this.maintenanceRepository.create(data);
    return this.maintenanceRepository.save(maintenance);
  }

  async findAll(skip = 0, take = 10): Promise<EquipmentMaintenance[]> {
    return this.maintenanceRepository.find({ skip, take });
  }

  async findOne(id: string): Promise<EquipmentMaintenance | null> {
    return this.maintenanceRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<EquipmentMaintenance>): Promise<EquipmentMaintenance | null> {
    await this.maintenanceRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.maintenanceRepository.delete(id);
  }
}
