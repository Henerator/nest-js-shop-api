import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  passwordHash: string;
}

export type AuthDocument = HydratedDocument<Auth>;

export const AuthSchema = SchemaFactory.createForClass(Auth);
