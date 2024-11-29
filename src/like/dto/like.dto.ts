import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class LikeDTO {
  @ApiProperty({
    description: 'The unique identifier of the post in MongoDB format',
    example: '60e6f9f1f3a2b12f4c3d1234',
  })
  @IsMongoId({ message: 'Post id is not valid' })
  postId: string;
}
