import { Document } from 'mongoose';

export interface IUserPost extends Document {
  readonly title: string;
  readonly content: string;
  readonly author: string;
}
