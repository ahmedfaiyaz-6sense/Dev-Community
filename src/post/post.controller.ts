import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePostDTO } from './dto/post.create_post.dto';
//import { UserPost } from './post.schema';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { IUserPost } from './post.interface';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post('/create_post')
  @UseGuards(AuthGuard())
  async create_post(
    @Body() createPost: CreatePostDTO,
    @Req() req,
  ): Promise<IUserPost> {
    const user = req.user;

    return this.postService.createPost(createPost, user);
  }

  @Get('/user_posts')
  @UseGuards(AuthGuard())
  async get_user_posts(@Req() req): Promise<IUserPost[]> {
    const user = req.user;
    return this.postService.getUserPosts(user);
  }
}
