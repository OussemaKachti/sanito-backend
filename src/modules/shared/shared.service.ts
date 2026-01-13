import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';
import { Patient } from '@modules/patients/entities/patient.entity';
import { Equipment } from '@modules/equipment/entities/equipment.entity';
import { Location } from '@modules/locations/entities/location.entity';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Equipment)
    private equipmentRepository: Repository<Equipment>,
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
  ) {}

  async validatePermissions(userId: string, action: string, resource: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) return false;

    // TODO: Implement role-based permission checks
    const permissions: Record<string, string[]> = {
      ADMIN: ['create', 'read', 'update', 'delete'],
      DOCTOR: ['read', 'update'],
      NURSE: ['read', 'create'],
      CHIEF: ['read', 'update'],
      TECHNICIAN: ['read'],
      STAFF: ['read'],
    };

    const allowedActions = permissions[user.role] || [];
    return allowedActions.includes(action);
  }

  async checkResourceOwnership(userId: string, resourceId: string): Promise<boolean> {
    // TODO: Implement resource ownership check
    return true;
  }

  async globalSearch(query: string, entityTypes?: string[], skip = 0, take = 20): Promise<any[]> {
    const results: any[] = [];

    if (!entityTypes || entityTypes.includes('patients')) {
      const patients = await this.patientRepository.find({
        where: [
          { firstName: Like(`%${query}%`) },
          { lastName: Like(`%${query}%`) },
          { email: Like(`%${query}%`) },
          { rfidBadgeId: Like(`%${query}%`) },
        ],
        take,
      });
      results.push(...patients.map((p) => ({ entityType: 'patient', ...p })));
    }

    if (!entityTypes || entityTypes.includes('equipment')) {
      const equipment = await this.equipmentRepository.find({
        where: [
          { name: Like(`%${query}%`) },
          { model: Like(`%${query}%`) },
          { serialNumber: Like(`%${query}%`) },
        ],
        take,
      });
      results.push(...equipment.map((e) => ({ entityType: 'equipment', ...e })));
    }

    if (!entityTypes || entityTypes.includes('locations')) {
      const locations = await this.locationRepository.find({
        where: [{ name: Like(`%${query}%`) }, { ward: Like(`%${query}%`) }],
        take,
      });
      results.push(...locations.map((l) => ({ entityType: 'location', ...l })));
    }

    if (!entityTypes || entityTypes.includes('users')) {
      const users = await this.userRepository.find({
        where: [{ firstName: Like(`%${query}%`) }, { lastName: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
        take,
      });
      results.push(...users.map((u) => ({ entityType: 'user', ...u })));
    }

    return results.slice(0, take);
  }

  async advancedSearch(filters: Record<string, any>, skip = 0, take = 20): Promise<any[]> {
    const results: any[] = [];

    if (filters.patients) {
      let query = this.patientRepository.createQueryBuilder('patient');

      if (filters.patients.status) {
        query = query.where('patient.status = :status', { status: filters.patients.status });
      }
      if (filters.patients.location) {
        query = query.andWhere('patient.locationId = :locationId', { locationId: filters.patients.location });
      }

      const patients = await query.skip(skip).take(take).getMany();
      results.push(...patients.map((p) => ({ type: 'patient', ...p })));
    }

    if (filters.equipment) {
      let query = this.equipmentRepository.createQueryBuilder('equipment');

      if (filters.equipment.status) {
        query = query.where('equipment.status = :status', { status: filters.equipment.status });
      }
      if (filters.equipment.type) {
        query = query.andWhere('equipment.type = :type', { type: filters.equipment.type });
      }

      const equipment = await query.skip(skip).take(take).getMany();
      results.push(...equipment.map((e) => ({ type: 'equipment', ...e })));
    }

    return results;
  }

  async health(): Promise<any> {
    return {
      status: 'UP',
      timestamp: new Date(),
      service: 'SANITIO Backend',
      version: '1.0.0',
    };
  }

  async status(): Promise<any> {
    const patientCount = await this.patientRepository.count();
    const equipmentCount = await this.equipmentRepository.count();
    const userCount = await this.userRepository.count();

    return {
      status: 'OK',
      timestamp: new Date(),
      database: 'CONNECTED',
      patients: patientCount,
      equipment: equipmentCount,
      users: userCount,
    };
  }

  async getDatabaseStats(): Promise<any> {
    const patientCount = await this.patientRepository.count();
    const equipmentCount = await this.equipmentRepository.count();
    const userCount = await this.userRepository.count();
    const locationCount = await this.locationRepository.count();

    return {
      patients: patientCount,
      equipment: equipmentCount,
      users: userCount,
      locations: locationCount,
      totalRecords: patientCount + equipmentCount + userCount + locationCount,
    };
  }

  async getSystemStats(): Promise<any> {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      uptime: Math.floor(uptime / 60) + ' minutes',
      memoryUsage: {
        rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + ' MB',
        heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
        heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
        external: (memoryUsage.external / 1024 / 1024).toFixed(2) + ' MB',
      },
      cpuUsage: {
        user: cpuUsage.user / 1000 + ' ms',
        system: cpuUsage.system / 1000 + ' ms',
      },
    };
  }
}
