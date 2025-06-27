import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    return this.postsRepository.savePost(createPostDto);
  }

  async deletePost(id: number): Promise<void> {
    const posts = await this.postsRepository.findAllPosts();
    if (!posts.find((p) => p.id === id)) {
      throw new NotFoundException('Post not found');
    }
    await this.postsRepository.deletePost(id);
  }

  async listPosts(): Promise<Post[]> {
    return this.postsRepository.findAllPosts();
  }
} 