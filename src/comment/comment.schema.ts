import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
//import { User } from '../user/user.schema';
//import { UserPost } from 'src/post/post.schema';
export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ type: String })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'UserPost' })
  from_post: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
