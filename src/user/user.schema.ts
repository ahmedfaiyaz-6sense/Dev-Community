import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: String })
  _id: string;
  
  @Prop({ unique: true })
  username: string;

  @Prop()
  password: string;

  @Prop()
  skills: [string];

  @Prop()
  experience: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
