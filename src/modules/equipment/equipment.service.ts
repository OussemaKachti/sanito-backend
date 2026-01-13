import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { EquipmentStatus } from '@common/enums/equipment-status.enum';

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

  async findByType(type: string, skip = 0, take = 10): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { equipmentType: type as any },
      skip,
      take,
    });
  }

  async findByLocation(locationId: string, skip = 0, take = 10): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { currentLocationId: locationId as any },
      skip,
      take,
    });
  }

  async findByStatus(status: EquipmentStatus, skip = 0, take = 10): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { status: status as any },
      skip,
      take,
    });
  }

  async updateStatus(equipmentId: string, newStatus: EquipmentStatus): Promise<Equipment> {
    const equipment = await this.findOne(equipmentId);
    equipment.status = newStatus;
    equipment.updatedAt = new Date();
    return this.equipmentRepository.save(equipment);
  }

  async updateLocation(equipmentId: string, newLocationId: string): Promise<Equipment> {
    const equipment = await this.findOne(equipmentId);
    equipment.currentLocationId = newLocationId;
    equipment.updatedAt = new Date();
    return this.equipmentRepository.save(equipment);
  }

  async getPositionHistory(equipmentId: string, skip = 0, take = 10): Promise<any[]> {
    return this.equipmentRepository
      .createQueryBuilder('equipment')
      .innerJoinAndSelect(
        'equipment.positionHistory',
        'history',
        'history.equipmentId = equipment.id'
      )
      .where('equipment.id = :equipmentId', { equipmentId })
      .orderBy('history.timestamp', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async checkMissingEquipment(): Promise<Equipment[]> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.equipmentRepository
      .createQueryBuilder('equipment')
      .where('equipment.lastLocationUpdate <= :cutoffTime', { cutoffTime: twentyFourHoursAgo })
      .getMany();
  }

  async getMaintenanceSchedule(equipmentId: string): Promise<any> {
    // TODO: Join with EquipmentMaintenance table for schedule
    const equipment = await this.findOne(equipmentId);
    return {
      equipment,
      nextMaintenanceDate: equipment.nextMaintenanceDate,
      lastMaintenanceDate: equipment.lastMaintenanceDate,
    };
  }

  async searchEquipment(query: string, skip = 0, take = 10): Promise<Equipment[]> {
    return this.equipmentRepository
      .createQueryBuilder('equipment')
      .where('equipment.name ILIKE :query', { query: `%${query}%` })
      .orWhere('equipment.model ILIKE :query', { query: `%${query}%` })
      .orWhere('equipment.serialNumber ILIKE :query', { query: `%${query}%` })
      .skip(skip)
      .take(take)
      .getMany();
  }
}
