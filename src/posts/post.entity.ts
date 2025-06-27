import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'posts' })
export class Post {
  @ApiProperty({
    description: 'Unique identifier for the post',
    example: 1,
    type: Number,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Title or name of the post',
    example: 'My First Blog Post',
    type: String,
    maxLength: 255,
  })
  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Optional detailed description or content of the post',
    example: 'This is a detailed description of my blog post content.',
    required: false,
    type: String,
    nullable: true,
  })
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;
}
