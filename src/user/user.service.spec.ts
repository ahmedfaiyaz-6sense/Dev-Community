import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { TestCases } from './test-cases/user.tests';
import { TestVerifier } from './test-cases/user.verifier';
import * as bcrypt from 'bcrypt';
//import { LoginUserDTO } from './dto/user.loginuser.dto';

const mocked_user: CreateUserDTO = {
  username: 'User',
  password: 'password',
  experience: 1,
  skills: ['A'],
};

const mockCreateUser = () => {
  const create_user = {
    _id: '674d7ad5fd6df0f1c9020fab',
    username: mocked_user['username'],
    skills: mocked_user['skills'],
    experience: mocked_user['experience'],
    _v0: 0,
  };
  return create_user;
};
const mockUpdateUser = () => {
  const update_user = {
    _id: '674d7ad5fd6df0f1c9020fax',
    username: 'User-1',
    skills: ['C'],
    experience: 10,
    _v0: 0,
  };
  return update_user;
};
const userModelMock = {
  //_id: jest.fn(),
  create: jest.fn(),
  findOne: jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue(mockCreateUser()),
  }),
  findOneAndUpdate: jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue(mockUpdateUser()),
  }),
  find: jest.fn(() => TestCases.listUser),
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
    })
      .overrideProvider(JwtService)
      .useValue({ sign: jest.fn().mockResolvedValue('mocked_token') })
      .compile();

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

      const result = await service.createUser(TestCases.createUser);
      //console.log(result);
      expect(result).toEqual(TestVerifier.createdUser);
      expect(model.create).toHaveBeenCalledWith(TestCases.createUser);
    });
  });

  describe('login', () => {
    it('Should return a access token for a user', async () => {
      const salt = await bcrypt.genSalt();
      const hashed_password = await bcrypt.hash(
        TestCases.loginUser.password,
        salt,
      );
      TestCases.loginUser.password = hashed_password;
      const result = await service.loginUser(TestCases.loginUser);
      expect(result).toEqual(TestVerifier.loggedInUser);
      //expect(service.loginUser).toHaveBeenCalledWith(LoginUserDTO);
      // console.log(result);
    });
  });

  describe('user-update', () => {
    it('Should update user skills and experience', async () => {
      const { updateSkillAndExp, user } = TestCases.updateUser;
      const result = await service.updateSkillsAndExp(updateSkillAndExp, user);
      expect(result).toEqual(TestVerifier.updatedUser);
    });
  });
});
