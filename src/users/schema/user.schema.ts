import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, index: true, unique: true })
  email: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: false })
  emailVerified: boolean;

  @Prop({ default: '' })
  wallet: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
