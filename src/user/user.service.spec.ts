import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { MockError } from './test-cases/customError';
import { TestCases } from './test-cases/user.tests';
import { TestVerifier } from './test-cases/user.verifier';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  });
  afterEach(() => {
    jest.restoreAllMocks();
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
    it('Should return conflict message if username already exist', async () => {
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('anything');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('anything');
      jest.spyOn(service['userModel'], 'create').mockImplementation(() => {
        if (TestCases.createUser.username == mocked_user.username) {
          throw new MockError('Duplicate error', 11000);
        } else {
          throw new BadRequestException('New User created');
        }
      });
      await expect(service.createUser(TestCases.createUser)).rejects.toThrow(
        ConflictException,
      );
    });
    it('Should return a server exception if anything bad occurs', async () => {
      jest.spyOn(service['userModel'], 'create').mockImplementation(() => {
        throw new MockError('Network connection unavailable', 19322);
      });
      await expect(service.createUser(TestCases.createUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('login', () => {
    it('Should return a access token for a user with valid creds', async () => {
      const correct_login = await service.loginUser(TestCases.loginUser);
      expect(correct_login).toEqual(TestVerifier.loggedInUser);
    });
    it('Should return a not found response for invalid password', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      await expect(
        service.loginUser(TestCases.loginUserWrongPassword),
      ).rejects.toThrow(NotFoundException);
    });
    it('Should return a not found response for username which does not exist', async () => {
      jest.spyOn(service['userModel'], 'findOne').mockResolvedValue(false);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      await expect(
        service.loginUser(TestCases.loginUsernameDoesNotExist),
      ).rejects.toThrow(NotFoundException);
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
