import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FCM_PROJECT_ID,
        privateKey: process.env.FCM_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FCM_CLIENT_EMAIL,
      }),
    });
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    return admin.messaging().send(message);
  }
}
