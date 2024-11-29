import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPost } from './post.schema';
import { Model } from 'mongoose';
import { CreatePostDTO } from './dto/post.create_post.dto';
import { IUser } from 'src/user/interfaces/user.interface';
import { IUserPost } from './interfaces/post.interface';
import { GetPostFilterDto } from './dto/post.filter_post.dto';
import { UpdatePostDTO } from './dto/post.update_post.dto';
import { Types } from 'mongoose';
@Injectable()
export class PostService {
  constructor(
    @InjectModel(UserPost.name) private postModel: Model<IUserPost>,
  ) {}
  public async createPost(
    post: CreatePostDTO,
    user: IUser,
  ): Promise<IUserPost> {
    const new_post = {
      title: post.title,
      content: post.content,
      author: user._id,
    };
    const createdPost = await this.postModel.create(new_post);

    /*const sanitizedPost = await this.postModel
      .findById(createdPost._id)
      .select('-password');*/

    return createdPost;
  }
  public async updatePost(
    updatePostDTO: UpdatePostDTO,
    postId: string,
  ): Promise<IUserPost> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Post id not found');
    }
    const { title, content } = updatePostDTO;
    const to_be_updated = {};
    if (title) {
      to_be_updated['title'] = title;
    }
    if (content) {
      to_be_updated['content'] = content;
    }
    if (!to_be_updated) {
      throw new BadRequestException('Please include either title or content');
    }
    const updatedPost = await this.postModel.findOneAndUpdate(
      { _id: postId },
      to_be_updated,
    );
    if (updatedPost) {
      return updatedPost;
    } else {
      throw new NotFoundException('Post not found.');
    }
  }
  public async deletePost(postId: string) {
    if (!Types.ObjectId.isValid(postId)) {
      throw new NotFoundException('Post not found');
    }
    const deletedResponse = await this.postModel.findOneAndDelete({
      _id: postId,
    });
    if (deletedResponse) {
      return deletedResponse;
    } else {
      throw new NotFoundException('Post not found');
    }
  }
  public async getUserPosts(user: IUser): Promise<IUserPost[]> {
    //console.log(user._id)
    //return await this.postModel.find({ author: user._id });
    const pipelines = [
      {
        $match: {
          author: user._id,
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'from_post',
          as: 'comments',
        },
      },
    ];
    const aggregated = await this.postModel.aggregate(pipelines);
    return aggregated;
  }
  public async getFilteredPosts(
    filter_post: GetPostFilterDto,
  ): Promise<IUserPost[]> {
    const { title, content } = filter_post;
    if (title) {
      return await this.postModel.findOne({ title });
    }

    return await this.postModel.findOne({ content });
  }

  public async getAllPosts(): Promise<IUserPost[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'from_post',
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'likes',
          localField: '_id',
          foreignField: 'from_post',
          as: 'likes',
        },
      },
      {
        $addFields: {
          likescount: {
            $sum: '$likes.counter',
          },
        },
      },
    ];
    const aggregated = await this.postModel.aggregate(pipeline);
    return aggregated;
  }
}
