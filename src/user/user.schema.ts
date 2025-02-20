import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collation: { locale: 'en', strength: 2 } })
export class User {
  @Prop({ unique: true })
  uuid: string;

  @Prop()
  wynnGuildId: string;

  @Prop()
  blockedUsers: string[];

  @Prop({ default: false })
  isMuted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
