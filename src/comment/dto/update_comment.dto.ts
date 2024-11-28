import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
//import { UserPost } from 'src/post/post.schema';
//import { User } from 'src/user/user.schema';
//import { Types } from 'mongoose';

export class UpdateCommentDTO {
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}
