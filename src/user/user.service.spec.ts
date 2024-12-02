import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { TestCases } from './test-cases/user.tests';
//import * as bcrypt from 'bcrypt';

const mocked_user: CreateUserDTO = {
  username: 'User',
  password: 'password',
  experience: 1,
  skills: ['A'],
};

const mockCreateUser = () => {
  const create_user = {
    _id: '674d7ad5fd6df0f1c9020fab',
    name: mocked_user['username'],
    skills: mocked_user['skills'],
    experience: mocked_user['experience'],
    _v0: 0,
  };
  return create_user;
};
const userModelMock = {
  //_id: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue(mockCreateUser()),
  }),
};
describe('UserService', () => {
  let service: UserService;
  let model: jest.Mocked<Model<User>>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: userModelMock,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    model = module.get(getModelToken(User.name));
  });

  describe('findAll', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('usercreation', () => {
    it('Should successfully create a user', async () => {
      model.create.mockResolvedValueOnce(mocked_user as any);
      const test_user: CreateUserDTO = {
        username: 'User',
        password: 'password',
        experience: 1,
        skills: ['A'],
      };
      const result = await service.createUser(test_user);
      //console.log(result);
      expect(result).toEqual(TestCases.createUserTestCase);
      expect(model.create).toHaveBeenCalledWith(test_user);
    });
  });
});
