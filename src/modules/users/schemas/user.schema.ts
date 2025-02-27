import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  phone: string;
  @Prop()
  address: string;
  @Prop()
  image: string;
  @Prop({ default: 'local' })
  account_type: string;
  @Prop({ default: 'user' })
  role: string;
  @Prop({ type: Boolean, default: false })
  is_active: boolean;
  @Prop()
  code_id: string;
  @Prop({type: Date})
  code_expired: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
