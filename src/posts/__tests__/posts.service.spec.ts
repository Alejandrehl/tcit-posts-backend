import { PostsService } from '../posts.service';
import { PostsRepository } from '../posts.repository';
import { CreatePostDto } from '../dto/create-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let repository: PostsRepository;

  beforeEach(() => {
    repository = {
      savePost: jest.fn(),
      deletePost: jest.fn(),
      findAllPosts: jest.fn(),
    } as any;
    service = new PostsService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // More tests to be added for 100% coverage
}); 