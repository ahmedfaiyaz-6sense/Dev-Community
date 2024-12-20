import { Injectable, NotFoundException } from '@nestjs/common';
import { IComment } from './interfaces/comment.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCommentDTO } from './dto/create_comment.dto';
import { IUser } from 'src/user/interfaces/user.interface';
import { Comment } from './comment.schema';
import { UserPost } from 'src/post/post.schema';
import { IUserPost } from 'src/post/interfaces/post.interface';
import { UpdateCommentDTO } from './dto/update_comment.dto';
import { Types } from 'mongoose';
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
    postId: string,
    user: IUser,
  ) {
    //console.log(postId);
    const isPost = await this.userPost.findOne({
      _id: postId,
    });
    if (isPost) {
      const craftComment = {
        content: createCommentDTO.content,
        author: user._id,
        from_post: isPost._id,
      };
      const createdComment = await this.commentModel.create(craftComment);
      return createdComment;
    } else {
      throw new NotFoundException('Post id is not valid');
    }
  }

  public async updateComment(
    updateCommentDTO: UpdateCommentDTO,
    commentId: string,
  ) {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException('Comment not found');
    }
    const { content } = updateCommentDTO;
    const isComment = await this.commentModel.findOne({ _id: commentId });
    if (isComment) {
      const new_comment = await this.commentModel.findOneAndUpdate(
        { _id: isComment._id },
        { content: content },
        { new: true },
      );
      return new_comment;
    } else {
      throw new NotFoundException('Comment not found');
    }
  }
  public async deleteComment(commentId: string) {
    if (!Types.ObjectId.isValid(commentId)) {
      throw new NotFoundException('Comment not found');
    }
    const deletedpost = await this.commentModel.findOneAndDelete({
      _id: commentId,
    });
    if (deletedpost) {
      return deletedpost;
    } else {
      throw new NotFoundException('Comment not found');
    }
  }
}
