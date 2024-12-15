import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly username: string;
  readonly password: string;
  readonly skills: [string];
  readonly experience: number;
  readonly refreshToken: string;
}
