import { IsOptional, IsString } from 'class-validator';
export class GetPostFilterDto {
  @IsOptional()
  @IsString()
  title?: string;
  @IsOptional()
  @IsString()
  content?: string;
}
