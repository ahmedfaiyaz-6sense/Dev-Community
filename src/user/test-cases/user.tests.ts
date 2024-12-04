import { CreateUserDTO } from '../dto/user.createuser.dto';
import { LoginUserDTO } from '../dto/user.loginuser.dto';
import { UpdateSkillsAndExperienceDTO } from '../dto/update_skills_and_experience.dto';
// TestCases.ts
export class TestCases {
  static createUser: CreateUserDTO = {
    username: 'User',
    password: 'Password',
    experience: 1,
    skills: ['A'],
  };
  static loginUser: LoginUserDTO = {
    username: 'User',
    password: 'Password',
  };
  static loginUserWrongPassword: LoginUserDTO = {
    username: 'User',
    password: 'Passwrd',
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
      password: 'Password',
      skills: ['a', 'b'],
      experience: 10,
      __v: 0,
    },
  ];

  static updateUser = {
    updateSkillAndExp: {
      skills: ['C'],
      experience: 10,
    } as UpdateSkillsAndExperienceDTO,
    user: {
      _id: '674d7ad5fd6df0f1c9020fax',
      username: 'User-1',
      skills: ['A'],
      experience: 10,
    } as any,
  };
}
