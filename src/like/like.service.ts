import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPost } from 'src/post/post.schema';
import { Like } from './like.schema';
import { ILike } from './interfaces/like.interface';
import { IUserPost } from 'src/post/interfaces/post.interface';
import { Model, Types } from 'mongoose';
import { IUser } from 'src/user/interfaces/user.interface';
import { LikeDTO } from './dto/like.dto';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<ILike>,
    @InjectModel(UserPost.name) private userPost: Model<IUserPost>,
  ) {}
  public async likePost(
    postId: string,
    user: IUser,
  ): Promise<ILike | { message: string }> {
    const findPost = await this.userPost.findOne({ _id: postId });
    if (findPost) {
      const findLike = await this.likeModel.findOne({
        from_post: findPost._id,
        liked_by: user._id,
      });
      const likeObject = {
        counter: 1,
        from_post: findPost._id,
        liked_by: user._id,
      };
      if (findLike) {
        if (findLike.counter == 0) {
          likeObject.counter = 1;
        } else if (findLike.counter == 1) {
          likeObject.counter = 0;
        }
        return await this.likeModel.findByIdAndUpdate(
          findLike._id,
          likeObject,
          { new: true },
        );
      } else {
        return await this.likeModel.create(likeObject);
      }
    } else {
      throw new NotFoundException('Post not found');
    }
  }
  public async getLikes(likeDTO: LikeDTO) {
    const { postId } = likeDTO;

    const likeCountOfPostPipeline = [
      {
        $match: {
          _id: { $eq: new Types.ObjectId(postId) },
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'from_post',
          as: 'result',
        },
      },
      {
        $project: {
          likesCount: { $sum: '$result.counter' },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ];
    const getLikes = await this.userPost.aggregate(likeCountOfPostPipeline);
    return getLikes[0];
  }
}
