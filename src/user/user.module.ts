import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { User } from './user';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [User, UserService],
})
export class UserModule {}
