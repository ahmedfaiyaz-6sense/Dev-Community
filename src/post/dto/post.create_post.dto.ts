import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/user.schema';

export class CreatePostDTO {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  author: User;
}
