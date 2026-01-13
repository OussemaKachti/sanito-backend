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

  async scheduleNewMaintenance(equipmentId: string, maintenanceType: string, scheduledDate: Date): Promise<EquipmentMaintenance> {
    const maintenance = this.maintenanceRepository.create({
      equipment: { id: equipmentId } as any,
      maintenanceType,
      scheduledDate,
      status: 'SCHEDULED' as any,
    });
    return this.maintenanceRepository.save(maintenance);
  }

  async getScheduledMaintenance(skip = 0, take = 10): Promise<EquipmentMaintenance[]> {
    return this.maintenanceRepository.find({
      where: { status: 'SCHEDULED' as any },
      skip,
      take,
      order: { scheduledDate: 'ASC' },
    });
  }

  async getCompletedMaintenance(skip = 0, take = 10): Promise<EquipmentMaintenance[]> {
    return this.maintenanceRepository.find({
      where: { status: 'COMPLETED' as any },
      skip,
      take,
      order: { scheduledDate: 'DESC' },
    });
  }

  async calculateNextMaintenanceDate(equipmentId: string): Promise<Date> {
    const lastMaintenance = await this.maintenanceRepository.findOne({
      where: { equipment: { id: equipmentId }, status: 'COMPLETED' as any },
      order: { scheduledDate: 'DESC' },
    });

    if (!lastMaintenance) return new Date(); // Default to today if no maintenance history

    const maintenanceIntervalDays = 30; // Default interval
    const nextDate = new Date(lastMaintenance.scheduledDate);
    nextDate.setDate(nextDate.getDate() + maintenanceIntervalDays);

    return nextDate;
  }
}
