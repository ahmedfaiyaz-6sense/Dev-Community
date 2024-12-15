import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JWTStrategy } from './jwt.strategy';
import { JWTRefreshStrategy } from './jwt.refresh.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
  ],

  controllers: [UserController],
  providers: [User, UserService, JWTStrategy, JWTRefreshStrategy],
})
export class UserModule {}
