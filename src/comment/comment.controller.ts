import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDTO } from './dto/create_comment.dto';
import { GetUser } from 'src/user/decorators/user.decorator';
import { IComment } from './interfaces/comment.interface';
import { IUser } from 'src/user/interfaces/user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post('/create-comment')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async create_post(
    @Body() createCommentDTO: CreateCommentDTO,
    /// @Req() req,
    @GetUser() user: IUser,
  ): Promise<IComment> {
    return this.commentService.createComment(createCommentDTO, user);
  }
}
