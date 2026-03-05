import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  private readonly logger = new Logger(FirebaseService.name);

  constructor(private configService: ConfigService) {
    // Initialize Firebase only once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: this.configService.get<string>('FIREBASE_PROJECT_ID'),
          private_key: this.configService
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
          client_email: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        } as admin.ServiceAccount),
      });

      this.logger.log('Firebase initialized');
    }
  }

  /**
   * Send FCM notification to a single device
   * @param token Device FCM token
   * @param title Notification title
   * @param body Notification body
   * @param data Optional data payload
   */
  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const message: admin.messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await admin.messaging().send(message);
      this.logger.log(`Notification sent: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification', error);
      throw error;
    }
  }
}
