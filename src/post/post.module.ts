import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserPostSchema, UserPost } from './post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserPost.name, schema: UserPostSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],

  providers: [PostService],
  controllers: [PostController],
  
})
export class PostModule {}
