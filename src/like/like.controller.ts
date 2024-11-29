import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/user/decorators/user.decorator';
import { IUser } from 'src/user/interfaces/user.interface';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  /*@Post(':postId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async like_post(@Param('postId') postId: string,@Body() ) {}*/
  constructor(private likeService: LikeService) {}

  @Post(':postId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async likePost(@Param('postId') postId: string, @GetUser() user: IUser) {
    return this.likeService.likePost(postId, user);
  }
}
