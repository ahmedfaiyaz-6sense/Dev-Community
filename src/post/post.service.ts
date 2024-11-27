import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPost } from './post.schema';
import { Model } from 'mongoose';
import { CreatePostDTO } from './dto/post.create_post.dto';
import { IUser } from 'src/user/user.interface';
import { IUserPost } from './post.interface';
import { GetPostFilterDto } from './dto/post.filter_post.dto';

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

  public async getUserPosts(user: IUser): Promise<IUserPost[]> {
    //console.log(user._id)
    return await this.postModel.find({ author: user._id });
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
}
