import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDTO {
  @IsNotEmpty()
  @ApiProperty({ description: 'Post title', example: 'Dummy title' })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Post Content', example: 'Dummy text' })
  content: string;
}
