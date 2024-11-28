import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDTO } from './dto/create_comment.dto';
import { GetUser } from 'src/user/decorators/user.decorator';
import { IComment } from './interfaces/comment.interface';
import { IUser } from 'src/user/interfaces/user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
//import { UpdateCommentDTO } from './dto/update_comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':post_id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async create_comment(
    @Param('post_id') post_id: string,
    @Body() createCommentDTO: CreateCommentDTO,
    /// @Req() req,
    @GetUser() user: IUser,
  ): Promise<IComment> {
    return this.commentService.createComment(createCommentDTO, post_id, user);
  }

  /*@Post('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async update_post(
    @Body() updateCommentDTO: UpdateCommentDTO,
    @Param(':id') comment_id: string,
  ) {
    return this.commentService.updateComment(updateCommentDTO, comment_id);
  }*/
}
