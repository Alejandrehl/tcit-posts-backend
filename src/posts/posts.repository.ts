import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async savePost(post: Partial<Post>): Promise<Post> {
    return this.postRepository.save(post);
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete(id);
  }

  async findAllPosts(): Promise<Post[]> {
    return this.postRepository.find();
  }
} 