import { CreateUserDTO } from '../dto/user.createuser.dto';

// TestCases.ts
export class TestCases {
  static createUser: CreateUserDTO = {
    username: 'User',
    password: 'password',
    experience: 1,
    skills: ['A'],
  };
}
