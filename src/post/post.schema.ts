import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../user/user.schema';
export type PostDocument = HydratedDocument<UserPost>;

@Schema()
export class UserPost {
  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: User;
}

export const UserPostSchema = SchemaFactory.createForClass(UserPost);
