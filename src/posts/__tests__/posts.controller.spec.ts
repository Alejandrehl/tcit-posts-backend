import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(() => {
    service = {
      createPost: jest.fn(),
      deletePost: jest.fn(),
      listPosts: jest.fn(),
    } as any;
    controller = new PostsController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // More tests to be added for 100% coverage
}); 