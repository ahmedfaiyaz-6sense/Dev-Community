import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  public async createUser(user: CreateUserDTO): Promise<User> {
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }
}
