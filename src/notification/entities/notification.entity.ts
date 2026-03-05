import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  userId: string;

  @Prop()
  title: string;

  @Prop()
  body: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  data: Record<string, any>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
