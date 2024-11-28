import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JWTStrategy } from './jwt.strategy';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: '2 days',
      },
    }),
  ],

  controllers: [UserController],
  providers: [User, UserService, JWTStrategy],
  exports: [PassportModule],
})
export class UserModule {}
