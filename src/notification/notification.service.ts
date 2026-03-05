import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { FirebaseService } from 'src/firebase.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const { token, title, body, data } = createNotificationDto;

    // Save notification in DB (optional)
    const notification = await this.notificationModel.create(
      createNotificationDto,
    );

    // Send push notification
    await this.firebaseService.sendNotification(token, title, body, data);

    return notification;
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().exec();
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification as Notification;
  }

  async update(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    const notification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.token) {
      await this.firebaseService.sendNotification(
        notification.token,
        notification.title,
        notification.body,
        notification.data,
      );
    }

    return notification as Notification;
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
