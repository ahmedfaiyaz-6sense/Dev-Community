import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/user/decorators/user.decorator';
import { IUser } from 'src/user/interfaces/user.interface';
import { LikeService } from './like.service';
import { LikeDTO } from './dto/like.dto';
import { AccessTokenGuard } from 'src/user/accessToken.guard';

@Controller('like')
export class LikeController {
  /*@Post(':postId')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async like_post(@Param('postId') postId: string,@Body() ) {}*/
  constructor(private likeService: LikeService) {}

  @Put(':postId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async likePost(@Param() likeDTO: LikeDTO, @GetUser() user: IUser) {
    const { postId } = likeDTO;
    return this.likeService.likePost(postId, user);
  }

  @Get('count/:postId')
  async getLikes(@Param() likeDTO: LikeDTO) {
    return this.likeService.getLikes(likeDTO);
  }
}
