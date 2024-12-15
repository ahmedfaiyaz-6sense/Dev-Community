import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Model } from 'mongoose';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { JWTRefreshPayload } from './user.jwt.refresh.payload.interface';
import { Request } from 'express';
@Injectable()
export class JWTRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload: JWTRefreshPayload): Promise<any> {
    const { username } = payload;

    const refreshToken = req.get('authorization').split(' ')[1].trim();

    //console.log(username);
    const user = await this.userModel.findOne({ username });
    //console.log(user);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      attributes: user,
      refreshToken: refreshToken,
    };
  }
}
