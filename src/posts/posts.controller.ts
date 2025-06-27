import {
  Controller,
  Post as HttpPost,
  Delete,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';

@ApiTags('posts')
@Controller('v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Creates a new post with the provided title and optional description.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Post data to create',
    examples: {
      example1: {
        summary: 'Create a post with title and description',
        value: {
          name: 'My First Blog Post',
          description:
            'This is a detailed description of my blog post content.',
        },
      },
      example2: {
        summary: 'Create a post with title only',
        value: {
          name: 'Simple Post',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
    type: PostEntity,
    schema: {
      example: {
        id: 1,
        name: 'My First Blog Post',
        description: 'This is a detailed description of my blog post content.',
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data. The request body does not meet validation requirements.',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'name should not be empty',
          'name must be a string',
          'name must be shorter than or equal to 255 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  @ApiOperation({
    summary: 'Delete a post by ID',
    description:
      'Deletes a post with the specified ID. Returns 204 if successful, 404 if post not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the post to delete',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 204,
    description: 'The post has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found with the specified ID.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Post not found',
        error: 'Not Found',
      },
    },
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(Number(id));
  }

  @ApiOperation({
    summary: 'List all posts',
    description: 'Retrieves a list of all posts in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all posts retrieved successfully.',
    type: [PostEntity],
    schema: {
      example: [
        {
          id: 1,
          name: 'My First Blog Post',
          description:
            'This is a detailed description of my blog post content.',
        },
        {
          id: 2,
          name: 'Another Post',
          description: 'Another post description.',
        },
      ],
    },
  })
  @Get()
  async list(): Promise<PostEntity[]> {
    return this.postsService.listPosts();
  }
}
