import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(dto);
    return notification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    if (!notification) throw new NotFoundException('Notification not found');
    return notification;
  }

  async update(id: string, dto: UpdateNotificationDto): Promise<Notification> {
    const updated = await this.notificationModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Notification not found');
    return updated;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.notificationModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Notification not found');
    return { message: 'Notification deleted successfully' };
  }

  // Optional helper: get all notifications for a user
  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).exec();
  }

  // Optional helper: mark a notification as read
  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { isRead: true });
  }
}
