import { ListPostsDto } from '../dto/list-posts.dto';

describe('ListPostsDto', () => {
  it('should be defined', () => {
    expect(new ListPostsDto()).toBeDefined();
  });
});
