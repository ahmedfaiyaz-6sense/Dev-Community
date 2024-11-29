import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { UserPost } from 'src/post/post.schema';
//import { User } from '../user/user.schema';
//import { UserPost } from 'src/post/post.schema';
export type CommentDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: Number })
  counter: number;
  @Prop({ type: Types.ObjectId, ref: 'User' })
  liked_by: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'UserPost' })
  from_post: UserPost;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
