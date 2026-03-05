import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema({ timestamps: true })
export class Token {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  role: string; // customer | seller | admin

  @Prop({ required: true, unique: true })
  token: string;

  @Prop()
  device: string; // android | ios | web
}

export const TokenSchema = SchemaFactory.createForClass(Token);
