import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './like.schema';
import { UserPost, UserPostSchema } from 'src/post/post.schema';
import { LikeService } from './like.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: UserPost.name, schema: UserPostSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
