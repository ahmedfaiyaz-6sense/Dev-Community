import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPost } from 'src/post/post.schema';
import { Like } from './like.schema';
import { ILike } from './interfaces/like.interface';
import { IUserPost } from 'src/post/interfaces/post.interface';
import { Model } from 'mongoose';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<ILike>,
    @InjectModel(UserPost.name) private userPost: Model<IUserPost>,
  ) {}
  public async likePost(postId: string, user: IUser) {
    const findPost = await this.userPost.find({ _id: postId });
    if (findPost) {
      const findLike = await this.likeModel.findOne({
        from_post: postId,
        liked_by: user._id,
      });
      if (findLike) {
        return {
          message: 'User already liked the post',
        };
      } else {
        const likeObject = {
          counter: 1,
          from_post: postId,
          liked_by: user._id,
        };
        return await this.likeModel.create(likeObject);
      }
    }
  }
}
