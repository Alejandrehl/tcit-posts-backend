import { PostsRepository } from '../posts.repository';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

describe('PostsRepository', () => {
  let repository: PostsRepository;
  let ormRepository: Partial<Repository<Post>>;

  beforeEach(() => {
    ormRepository = {
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    };
    repository = new PostsRepository(ormRepository as Repository<Post>);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should save a post', async () => {
    const inputPost: Partial<Post> = { name: 'Test', description: 'Content' };
    const expectedPost: Post = { id: 1, name: 'Test', description: 'Content' };
    (ormRepository.save as jest.Mock).mockResolvedValue(expectedPost);
    const actualPost = await repository.savePost(inputPost);
    expect(actualPost).toEqual(expectedPost);
    expect(ormRepository.save).toHaveBeenCalledWith(inputPost);
  });

  it('should delete a post', async () => {
    const inputId = 1;
    (ormRepository.delete as jest.Mock).mockResolvedValue(undefined);
    await repository.deletePost(inputId);
    expect(ormRepository.delete).toHaveBeenCalledWith(inputId);
  });

  it('should find all posts', async () => {
    const expectedPosts: Post[] = [
      { id: 1, name: 'A', description: 'A' },
      { id: 2, name: 'B', description: 'B' },
    ];
    (ormRepository.find as jest.Mock).mockResolvedValue(expectedPosts);
    const actualPosts = await repository.findAllPosts();
    expect(actualPosts).toEqual(expectedPosts);
    expect(ormRepository.find).toHaveBeenCalled();
  });

  // More tests to be added for 100% coverage
});
