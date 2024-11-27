import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWTPayload } from './user.jwt.payload.interface';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      secretOrKey: process.env.SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: JWTPayload): Promise<User> {
    const { username } = payload;
    console.log(username);
    const user = await this.userModel.findOne({ username });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
