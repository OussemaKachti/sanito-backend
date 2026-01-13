import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { LocationType } from '@common/enums/location-type.enum';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async create(data: Partial<Location>): Promise<Location> {
    const location = this.locationRepository.create(data);
    return this.locationRepository.save(location);
  }

  async findAll(skip = 0, take = 10): Promise<Location[]> {
    return this.locationRepository.find({ skip, take });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({ where: { id } });
    if (!location) throw new NotFoundException('Location not found');
    return location;
  }

  async update(id: string, data: Partial<Location>): Promise<Location> {
    await this.findOne(id);
    await this.locationRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.locationRepository.delete(id);
  }

  async getOccupancy(locationId: string): Promise<any> {
    const location = await this.findOne(locationId);
    const patientCount = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.patients', 'patient')
      .where('location.id = :locationId', { locationId })
      .getCount();

    const equipmentCount = await this.locationRepository
      .createQueryBuilder('location')
      .leftJoin('location.equipment', 'equipment')
      .where('location.id = :locationId', { locationId })
      .getCount();

    return {
      locationId,
      patients: patientCount,
      equipment: equipmentCount,
      total: patientCount + equipmentCount,
      capacity: location.capacity,
      occupancyPercentage: ((patientCount / (location.capacity || 1)) * 100).toFixed(2),
    };
  }

  async getOccupants(locationId: string): Promise<any> {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['patients', 'equipment'],
    });
    if (!location) throw new NotFoundException('Location not found');

    return {
      location: location.name,
      patients: location.patients || [],
      equipment: location.equipment || [],
    };
  }

  async findByType(type: LocationType, skip = 0, take = 10): Promise<Location[]> {
    return this.locationRepository.find({
      where: { type: type as any },
      skip,
      take,
    });
  }

  async findByWard(ward: string, skip = 0, take = 10): Promise<Location[]> {
    return this.locationRepository.find({
      where: { ward },
      skip,
      take,
    });
  }

  async getOccupationHistory(locationId: string, dateRange?: { start: Date; end: Date }, skip = 0, take = 10): Promise<any[]> {
    const query = this.locationRepository
      .createQueryBuilder('location')
      .innerJoinAndSelect('location.patients', 'patient', 'patient.locationId = location.id')
      .where('location.id = :locationId', { locationId });

    if (dateRange) {
      query.andWhere('patient.admissionDate >= :startDate', { startDate: dateRange.start });
      query.andWhere('patient.dischargeDate <= :endDate', { endDate: dateRange.end });
    }

    return query
      .orderBy('patient.admissionDate', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
  }
}
