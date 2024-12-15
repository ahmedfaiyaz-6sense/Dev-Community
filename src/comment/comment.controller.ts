import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDTO } from './dto/create_comment.dto';
import { GetUser } from 'src/user/decorators/user.decorator';
import { IComment } from './interfaces/comment.interface';
import { IUser } from 'src/user/interfaces/user.interface';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateCommentDTO } from './dto/update_comment.dto';
import { AccessTokenGuard } from 'src/user/accessToken.guard';
//import { UpdateCommentDTO } from './dto/update_comment.dto';

@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':postId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async createComment(
    @Param('postId') postId: string,
    @Body() createCommentDTO: CreateCommentDTO,
    /// @Req() req,
    @GetUser() user: IUser,
  ): Promise<IComment> {
    //console.log(postId);
    return this.commentService.createComment(createCommentDTO, postId, user);
  }

  @Patch(':commentId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async updateComment(
    @Body() updateCommentDTO: UpdateCommentDTO,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.updateComment(updateCommentDTO, commentId);
  }

  @Delete(':commentId')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  async delete_comment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
