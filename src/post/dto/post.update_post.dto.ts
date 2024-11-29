import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePostDTO {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Post title', example: 'Dummy title' })
  title: string;

  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({ description: 'Post Content', example: 'Dummy text' })
  content: string;
}
