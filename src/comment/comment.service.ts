import { Injectable, NotFoundException } from '@nestjs/common';
import { IComment } from './interfaces/comment.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDTO } from './dto/create_comment.dto';
import { IUser } from 'src/user/interfaces/user.interface';
import { Comment } from './comment.schema';
import { UserPost } from 'src/post/post.schema';
import { IUserPost } from 'src/post/interfaces/post.interface';
//import { UpdateCommentDTO } from './dto/update_comment.dto';
//import { NotFoundError } from 'rxjs';
@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<IComment>,
    @InjectModel(UserPost.name) private userPost: Model<IUserPost>,
  ) {}
  public async createComment(
    createCommentDTO: CreateCommentDTO,
    post_id: string,
    user: IUser,
  ) {
    const isPost = await this.userPost.findOne({
      _id: post_id,
    });
    if (isPost) {
      const craftComment = {
        content: createCommentDTO.content,
        author: user._id,
        from_post: post_id,
      };
      const createdComment = await this.commentModel.create(craftComment);
      return createdComment;
    } else {
      throw new NotFoundException('Post id is not valid');
    }
  }

  /*public async updateComment(updateCommentDTO: UpdateCommentDTO){
    const { content,comment_id }=
    const isComment = await this.commentModel.findOne()
  }*/
}
