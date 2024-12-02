import { Test } from '@nestjs/testing';
import { PostService } from './post.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserPost } from './post.schema';
import { Model } from 'mongoose';
import { TestCases } from './test-cases/post.tests';
import { TestVerifier } from './test-cases/post.verifier';
const mockUserPost = {
  title: 'string',
  content: 'string',
  author: '67470e3de1cf3f25218d9a2c',
  _id: '674d9f7f7296922d9200ec19',
  __v: 0,
};
describe(' Test suite', () => {
  let Service: PostService;
  let model: jest.Mocked<Model<UserPost>>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getModelToken(UserPost.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn().mockResolvedValue(mockUserPost),
          },
        },
      ],
    }).compile();

    Service = module.get<PostService>(PostService);
    model = module.get(getModelToken(UserPost.name));
  });

  it('should be defined', () => {
    expect(Service).toBeDefined();
  });

  describe('create_post', () => {
    it('Should create a post successfully', async () => {
      const result = await Service.createPost(
        TestCases.createPost,
        TestCases.user,
      );
      expect(result).toEqual(TestVerifier.createdPost);
    });
  });
});
