import { Document } from 'mongoose';

export interface IComment extends Document {
  readonly content: string;
  readonly author: string;
  readonly from_post: string;
}
