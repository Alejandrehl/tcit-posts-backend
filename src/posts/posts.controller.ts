import { Controller, Post as HttpPost, Delete, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';

@ApiTags('posts')
@Controller('v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({ status: 201, type: PostEntity })
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  @ApiOperation({ summary: 'Delete a post' })
  @ApiResponse({ status: 204 })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(Number(id));
  }

  @ApiOperation({ summary: 'List all posts' })
  @ApiResponse({ status: 200, type: [PostEntity] })
  @Get()
  async list(): Promise<PostEntity[]> {
    return this.postsService.listPosts();
  }
} 