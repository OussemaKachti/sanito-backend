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

  async sendEmail(to: string, subject: string, message: string): Promise<any> {
    // TODO: Integrate email service (sendgrid, nodemailer, etc.)
    return {
      to,
      subject,
      message,
      status: 'QUEUED',
      sentAt: new Date(),
    };
  }

  async sendSMS(phone: string, message: string): Promise<any> {
    // TODO: Integrate SMS service (twilio, etc.)
    return {
      phone,
      message,
      status: 'QUEUED',
      sentAt: new Date(),
    };
  }

  async sendPush(userId: string, title: string, message: string): Promise<Notification> {
    const notification = this.notificationRepository.create({
      recipientUserId: userId,
      title,
      message,
      notificationType: 'PUSH',
    } as any);
    const saved = await this.notificationRepository.save(notification);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async sendWebSocket(userId: string, data: any): Promise<any> {
    // TODO: Integrate with WebSocket gateway
    return {
      userId,
      data,
      status: 'SENT',
      sentAt: new Date(),
    };
  }

  async queueNotification(data: any): Promise<any> {
    const notification = this.notificationRepository.create(data);
    return this.notificationRepository.save(notification);
  }

  async retryFailedNotifications(): Promise<number> {
    // TODO: Implement retry logic for failed notifications
    const failedNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.status = :status', { status: 'FAILED' })
      .andWhere('notification.retryCount < 3')
      .getMany();

    for (const notif of failedNotifications) {
      notif.retryCount = (notif.retryCount || 0) + 1;
      await this.notificationRepository.save(notif);
    }

    return failedNotifications.length;
  }

  async getNotificationStats(dateRange?: { start: Date; end: Date }): Promise<any> {
    let query = this.notificationRepository.createQueryBuilder('notification');

    if (dateRange) {
      query.where('notification.createdAt >= :startDate', { startDate: dateRange.start });
      query.andWhere('notification.createdAt <= :endDate', { endDate: dateRange.end });
    }

    const total = await query.getCount();
    const read = await query.andWhere('notification.readAt IS NOT NULL').getCount();
    const delivered = await query.andWhere('notification.status = :status', { status: 'DELIVERED' }).getCount();
    const failed = await query.andWhere('notification.status = :status', { status: 'FAILED' }).getCount();

    return {
      total,
      read,
      delivered,
      failed,
      readPercentage: ((read / total) * 100).toFixed(2),
    };
  }
}
