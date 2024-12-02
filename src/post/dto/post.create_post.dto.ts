import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';
//import { User } from 'src/user/user.schema';

export class CreatePostDTO {
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  content: string;
  //author: User;
}
