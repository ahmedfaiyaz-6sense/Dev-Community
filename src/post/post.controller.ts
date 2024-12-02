import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  //Param,
  Post,
  // Query,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDTO } from './dto/post.create_post.dto';
//import { UserPost } from './post.schema';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { IUserPost } from './interfaces/post.interface';
//import { GetPostFilterDto } from './dto/post.filter_post.dto';
import { IUser } from 'src/user/interfaces/user.interface';
import { GetUser } from 'src/user/decorators/user.decorator';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { UpdatePostDTO } from './dto/post.update_post.dto';
import { UserPost } from './post.schema';

@Controller('post')
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}
  @Post('/create-post')
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({
    description: 'Post successfully created.',
    type: UserPost,
  })
  async create_post(
    @Body() createPost: CreatePostDTO,
    /// @Req() req,
    @GetUser() user: IUser,
  ): Promise<IUserPost> {
    return this.postService.createPost(createPost, user);
  }

  @Patch('/update-post/:postId')
  @UseGuards(AuthGuard())
  async update_post(
    @Body() updatePostDTO: UpdatePostDTO,
    @Param('postId') postId: string,
  ) {
    return this.postService.updatePost(updatePostDTO, postId);
  }

  @Delete('/delete-post/:postId')
  @UseGuards(AuthGuard())
  async delete_post(@Param('postId') postId: string) {
    return this.postService.deletePost(postId);
  }

  @Get('/user-posts')
  @UseGuards(AuthGuard())
  async get_user_posts(@GetUser() user): Promise<IUserPost[]> {
    return this.postService.getUserPosts(user);
  }

  /*@Get('/filtered')
  async get_filtered_posts(
    @Query() postFilterDTO: GetPostFilterDto,
  ): Promise<IUserPost[]> {
    //to be implemented
    return this.postService.getFilteredPosts(postFilterDTO);
  }*/

  @Get('/all')
  async get_all_post() {
    return this.postService.getAllPosts();
  }
  @Get('/:postId')
  async getPost(@Param('postId') postId: string) {
    return this.postService.getPost(postId);
  }
}
