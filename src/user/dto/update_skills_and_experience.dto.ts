import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSkillsAndExperienceDTO {
  @IsOptional()
  @ApiProperty()
  skills: [string];
  @IsOptional()
  @IsNumber()
  @ApiProperty()
  experience: number;
}
