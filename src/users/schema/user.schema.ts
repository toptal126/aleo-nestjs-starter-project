import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, index: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, default: false })
  emailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
