import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Post title' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: 'Optional description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
} 