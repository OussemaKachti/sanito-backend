import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async send(data: Partial<Notification>): Promise<Notification> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async findAll(skip = 0, take = 10): Promise<Notification[]> {
    return this.notificationRepository.find({
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Notification | null> {
    return this.notificationRepository.findOne({ where: { id } });
  }

  async markAsRead(id: string): Promise<Notification | null> {
    await this.notificationRepository.update(id, { readAt: new Date() });
    return this.findOne(id);
  }
}
