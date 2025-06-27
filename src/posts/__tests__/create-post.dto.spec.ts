import { CreatePostDto } from '../dto/create-post.dto';

describe('CreatePostDto', () => {
  it('should be defined', () => {
    expect(new CreatePostDto()).toBeDefined();
  });
});
