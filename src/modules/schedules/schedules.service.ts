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

  async checkConflicts(userId: string, startTime: Date, endTime: Date, locationId?: string): Promise<any[]> {
    let query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.userId = :userId', { userId })
      .andWhere('schedule.startTime < :endTime', { endTime })
      .andWhere('schedule.endTime > :startTime', { startTime });

    if (locationId) {
      query.andWhere('schedule.locationId = :locationId', { locationId });
    }

    return query.getMany();
  }

  async getScheduleByUser(userId: string, dateRange?: { start: Date; end: Date }, skip = 0, take = 20): Promise<Schedule[]> {
    let query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.userId = :userId', { userId });

    if (dateRange) {
      query.andWhere('schedule.startTime >= :startDate', { startDate: dateRange.start });
      query.andWhere('schedule.endTime <= :endDate', { endDate: dateRange.end });
    }

    return query
      .orderBy('schedule.startTime', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getScheduleByLocation(locationId: string, dateRange?: { start: Date; end: Date }, skip = 0, take = 20): Promise<Schedule[]> {
    let query = this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.locationId = :locationId', { locationId });

    if (dateRange) {
      query.andWhere('schedule.startTime >= :startDate', { startDate: dateRange.start });
      query.andWhere('schedule.endTime <= :endDate', { endDate: dateRange.end });
    }

    return query
      .orderBy('schedule.startTime', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getScheduleByDateRange(startDate: Date, endDate: Date, skip = 0, take = 20): Promise<Schedule[]> {
    return this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.startTime >= :startDate', { startDate })
      .andWhere('schedule.endTime <= :endDate', { endDate })
      .orderBy('schedule.startTime', 'ASC')
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getAvailability(userId: string, dateRange: { start: Date; end: Date }): Promise<Date[]> {
    const busySlots = await this.getScheduleByUser(userId, dateRange);
    const allSlots: Date[] = [];
    const workingHours = { start: 8, end: 17 }; // 8 AM to 5 PM

    for (let d = new Date(dateRange.start); d <= dateRange.end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() >= 1 && d.getDay() <= 5) {
        // Weekdays only
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
          const slot = new Date(d);
          slot.setHours(hour);
          const isBusy = busySlots.some((s) => s.startTime <= slot && s.endTime > slot);
          if (!isBusy) allSlots.push(new Date(slot));
        }
      }
    }

    return allSlots;
  }
}
