import { PostsService } from '../posts.service';
import { PostsRepository } from '../posts.repository';
import { NotFoundException } from '@nestjs/common';
import { Post } from '../post.entity';
import { CreatePostDto } from '../dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Partial<PostsRepository>;

  beforeEach(() => {
    repository = {
      savePost: jest.fn(),
      deletePost: jest.fn(),
      findAllPosts: jest.fn(),
    };
    service = new PostsService(repository as PostsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a post', async () => {
    const inputCreatePost: CreatePostDto = {
      name: 'Test',
      description: 'Content',
    };
    const expectedPost: Post = { id: 1, name: 'Test', description: 'Content' };
    (repository.savePost as jest.Mock).mockResolvedValue(expectedPost);
    const actualPost = await service.createPost(inputCreatePost);
    expect(actualPost).toEqual(expectedPost);
    expect(repository.savePost).toHaveBeenCalledWith(inputCreatePost);
  });

  it('should list all posts', async () => {
    const expectedPosts: Post[] = [
      { id: 1, name: 'A', description: 'A' },
      { id: 2, name: 'B', description: 'B' },
    ];
    (repository.findAllPosts as jest.Mock).mockResolvedValue(expectedPosts);
    const actualPosts = await service.listPosts();
    expect(actualPosts).toEqual(expectedPosts);
    expect(repository.findAllPosts).toHaveBeenCalled();
  });

  it('should delete a post if it exists', async () => {
    const inputId = 1;
    const mockPosts: Post[] = [
      { id: 1, name: 'A', description: 'A' },
      { id: 2, name: 'B', description: 'B' },
    ];
    (repository.findAllPosts as jest.Mock).mockResolvedValue(mockPosts);
    (repository.deletePost as jest.Mock).mockResolvedValue(undefined);
    await service.deletePost(inputId);
    expect(repository.findAllPosts).toHaveBeenCalled();
    expect(repository.deletePost).toHaveBeenCalledWith(inputId);
  });

  it('should throw NotFoundException when deleting a non-existent post', async () => {
    const inputId = 99;
    const mockPosts: Post[] = [
      { id: 1, name: 'A', description: 'A' },
      { id: 2, name: 'B', description: 'B' },
    ];
    (repository.findAllPosts as jest.Mock).mockResolvedValue(mockPosts);
    await expect(service.deletePost(inputId)).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.findAllPosts).toHaveBeenCalled();
    expect(repository.deletePost).not.toHaveBeenCalled();
  });
});
