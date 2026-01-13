import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
  ) {}

  async log(
    action: string,
    entityType: string,
    entityId: string,
    userId?: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    const log = this.activityLogRepository.create({
      action,
      entityType,
      entityId,
      userId,
      oldValues,
      newValues,
      ipAddress,
      userAgent,
    });
    return this.activityLogRepository.save(log);
  }

  async findAll(skip = 0, take = 10): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, skip = 0, take = 10): Promise<ActivityLog[]> {
    return this.activityLogRepository.find({
      where: { userId },
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<ActivityLog | null> {
    return this.activityLogRepository.findOne({ where: { id } });
  }

  async getStats(): Promise<{
    totalLogs: number;
    actionCounts: Record<string, number>;
  }> {
    const totalLogs = await this.activityLogRepository.count();
    const logs = await this.activityLogRepository.find();
    const actionCounts = {};

    logs.forEach((log) => {
      actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
    });

    return { totalLogs, actionCounts };
  }
}
