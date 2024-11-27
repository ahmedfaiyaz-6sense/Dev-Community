import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { IUser } from './user.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/user.loginuser.dto';
import { JWTPayload } from './user.jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  public async createUser(user: CreateUserDTO): Promise<IUser> {
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
  public async loginUser(
    user: LoginUserDTO,
  ): Promise<{ access_token: string }> {
    const found_user = await this.userModel.find({ username: user.username });
    if (!found_user.length) {
      throw new NotFoundException('Username or password is wrong');
    }
    const verify = bcrypt.compare(found_user[0].password, user.password);
    if (!verify) {
      throw new NotFoundException('Username or password is wrong');
    } else {
      const username = found_user[0].username;
      //console.log(username);
      const payload: JWTPayload = {
        username,
      };
      const access_token = await this.jwtService.sign(payload);
      return { access_token };
    }
  }
}
