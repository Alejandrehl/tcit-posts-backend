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
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostEntity } from './post.entity';

class ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}

@ApiTags('posts')
@ApiExtraModels(ErrorResponse)
@Controller('v1/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  /**
   * Create a new post
   * @param createPostDto Post data
   * @returns The created post
   */
  @ApiOperation({
    summary: 'Create a new post',
    description:
      'Creates a new post with the provided title and optional description. Title is required and must be a string up to 255 characters.',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Post data to create',
    required: true,
    examples: {
      withDescription: {
        summary: 'Create a post with title and description',
        value: {
          name: 'My First Blog Post',
          description:
            'This is a detailed description of my blog post content.',
        },
      },
      onlyTitle: {
        summary: 'Create a post with title only',
        value: {
          name: 'Simple Post',
        },
      },
      invalid: {
        summary: 'Invalid post (missing title)',
        value: {
          description: 'Missing title should trigger validation error.',
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
      $ref: getSchemaPath(ErrorResponse),
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
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    schema: {
      $ref: getSchemaPath(ErrorResponse),
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @HttpPost()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  /**
   * Delete a post by ID
   * @param id Post ID
   */
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
    required: true,
  })
  @ApiResponse({
    status: 204,
    description:
      'The post has been successfully deleted. No content is returned.',
  })
  @ApiNotFoundResponse({
    description: 'Post not found with the specified ID.',
    schema: {
      $ref: getSchemaPath(ErrorResponse),
      example: {
        statusCode: 404,
        message: 'Post not found',
        error: 'Not Found',
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    schema: {
      $ref: getSchemaPath(ErrorResponse),
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.postsService.deletePost(Number(id));
  }

  /**
   * List all posts
   * @returns Array of posts
   */
  @ApiOperation({
    summary: 'List all posts',
    description:
      'Retrieves a list of all posts in the system. Returns an empty array if there are no posts.',
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
  @ApiInternalServerErrorResponse({
    description: 'Unexpected server error.',
    schema: {
      $ref: getSchemaPath(ErrorResponse),
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  @Get()
  async list(): Promise<PostEntity[]> {
    return this.postsService.listPosts();
  }
}
