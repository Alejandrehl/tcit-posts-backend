import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Title or name of the post to be created',
    example: 'My First Blog Post',
    type: String,
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({
    description: 'Optional detailed description or content of the post',
    example: 'This is a detailed description of my blog post content.',
    required: false,
    type: String,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
