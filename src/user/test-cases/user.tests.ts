import { CreateUserDTO } from '../dto/user.createuser.dto';
import { LoginUserDTO } from '../dto/user.loginuser.dto';
// TestCases.ts
export class TestCases {
  static createUser: CreateUserDTO = {
    username: 'User',
    password: 'password',
    experience: 1,
    skills: ['A'],
  };
  static loginUser: LoginUserDTO = {
    username: 'User',
    password: 'Password',
  };
  static listUser = [
    {
      _id: '674d7ad5fd6df0f1c9020fab',
      username: 'User',
      password: 'Password',
      skills: ['A'],
      experience: 1,
      _v0: 0,
    },
    {
      _id: '674705cc543615a9a296ff69',
      username: 'abfcde',
      password: 'password',
      skills: ['a', 'b'],
      experience: 10,
      __v: 0,
    },
  ];
}
