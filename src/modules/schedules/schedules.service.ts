import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async create(data: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.scheduleRepository.create(data);
    return this.scheduleRepository.save(schedule);
  }

  async findAll(skip = 0, take = 10): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      skip,
      take,
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Schedule | null> {
    return this.scheduleRepository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Schedule>): Promise<Schedule | null> {
    await this.scheduleRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.scheduleRepository.delete(id);
  }
}
