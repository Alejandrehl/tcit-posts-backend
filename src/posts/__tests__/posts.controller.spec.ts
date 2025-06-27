import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import { NotFoundException } from '@nestjs/common';
import { CreatePostDto } from '../dto/create-post.dto';
import { Post } from '../post.entity';

describe('PostsController', () => {
  let controller: PostsController;
  let service: Partial<PostsService>;

  beforeEach(() => {
    service = {
      createPost: jest.fn(),
      deletePost: jest.fn(),
      listPosts: jest.fn(),
    };
    controller = new PostsController(service as PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a post', async () => {
    const inputDto: CreatePostDto = { name: 'Test', description: 'Content' };
    const expectedPost: Post = { id: 1, name: 'Test', description: 'Content' };
    (service.createPost as jest.Mock).mockResolvedValue(expectedPost);
    const actualPost = await controller.create(inputDto);
    expect(actualPost).toEqual(expectedPost);
    expect(service.createPost).toHaveBeenCalledWith(inputDto);
  });

  it('should list all posts', async () => {
    const expectedPosts: Post[] = [
      { id: 1, name: 'A', description: 'A' },
      { id: 2, name: 'B', description: 'B' },
    ];
    (service.listPosts as jest.Mock).mockResolvedValue(expectedPosts);
    const actualPosts = await controller.list();
    expect(actualPosts).toEqual(expectedPosts);
    expect(service.listPosts).toHaveBeenCalled();
  });

  it('should delete a post', async () => {
    (service.deletePost as jest.Mock).mockResolvedValue(undefined);
    await controller.delete('1');
    expect(service.deletePost).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when deleting a non-existent post', async () => {
    (service.deletePost as jest.Mock).mockRejectedValue(
      new NotFoundException('Post not found'),
    );
    await expect(controller.delete('99')).rejects.toThrow(NotFoundException);
    expect(service.deletePost).toHaveBeenCalledWith(99);
  });

  // More tests to be added for 100% coverage
});
