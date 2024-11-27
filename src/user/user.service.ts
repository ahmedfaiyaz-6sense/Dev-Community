import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/user.loginuser.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  public async createUser(user: CreateUserDTO): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(user.password, salt);
    user.password = hashed_password;
    try {
      const createdUser = await this.userModel.create(user);
      return createdUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException('Unknown error function');
      }
    }
  }
  public async loginUser(user: LoginUserDTO): Promise<User> {
    const found_user = await this.userModel.find({ username: user.username });
    if (!found_user.length) {
      throw new NotFoundException('Username or password is wrong');
    }
    const verify = bcrypt.compare(found_user[0].password, user.password);
    if (!verify) {
      throw new NotFoundException('Username or password is wrong');
    } else {
      return found_user[0];
    }
  }
}
