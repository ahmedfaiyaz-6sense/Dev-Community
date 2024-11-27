import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserPost } from './post.schema';
import { Model } from 'mongoose';
import { CreatePostDTO } from './dto/post.create_post.dto';
import { User } from 'src/user/user.schema';

@Injectable()
export class PostService {
  constructor(@InjectModel(UserPost.name) private postModel: Model<UserPost>) {}
  public async createPost(post: CreatePostDTO, user: User): Promise<UserPost> {
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

  public async getUserPosts(user: User): Promise<UserPost[]> {
    //console.log(user._id)
    return await this.postModel.find({ author: user._id });
  }
}
