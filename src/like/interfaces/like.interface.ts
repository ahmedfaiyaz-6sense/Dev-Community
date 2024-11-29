import { Document } from 'mongoose';

export interface ILike extends Document {
  readonly counter: number;
  readonly liked_by: string;
  readonly from_post: string;
}
