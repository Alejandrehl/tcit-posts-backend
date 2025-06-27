import { PostsRepository } from '../posts.repository';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';

describe('PostsRepository', () => {
  let repository: PostsRepository;
  let ormRepository: jest.Mocked<Repository<Post>>;

  beforeEach(() => {
    ormRepository = {
      save: jest.fn(),
      delete: jest.fn(),
      find: jest.fn(),
    } as any;
    repository = new PostsRepository(ormRepository as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  // More tests to be added for 100% coverage
}); 