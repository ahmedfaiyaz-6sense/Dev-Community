import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { Model } from 'mongoose';
import { IUser } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from './dto/user.loginuser.dto';
import { JWTPayload } from './user.jwt.payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.schema';
import { UpdateSkillsAndExperienceDTO } from './dto/update_skills_and_experience.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  public async createUser(user: CreateUserDTO): Promise<IUser> {
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(user.password, salt);
    user.password = hashed_password;
    try {
      const createdUser = await this.userModel.create(user);
      //console.log(createdUser);
      const santizedUser = await this.userModel
        .findOne({
          _id: createdUser._id,
        })
        .select('-password');
      //console.log(santizedUser);
      return santizedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists.');
      } else {
        console.log(error);
        throw new InternalServerErrorException('Unknown error function');
      }
    }
  }
  public async loginUser(
    user: LoginUserDTO,
  ): Promise<{ access_token: string }> {
    const found_user = await this.userModel.findOne({
      username: user.username,
    });

    if (!found_user) {
      throw new NotFoundException('Username or password is wrong');
    }
    //console.log(found_user.password, user.password);
    const verify = await bcrypt.compare(user.password, found_user.password);

    if (!verify) {
      throw new NotFoundException('Username or password is wrong');
    } else {
      const username = found_user.username;
      // console.log(username);
      const payload: JWTPayload = {
        username,
      };
      const access_token = await this.jwtService.sign(payload);
      return { access_token };
    }
  }
  public async updateSkillsAndExp(
    updateSkillsAndExpDTO: UpdateSkillsAndExperienceDTO,
    user: IUser,
  ) {
    const { skills, experience } = updateSkillsAndExpDTO;
    const to_be_updated = {};
    if (skills) {
      to_be_updated['skills'] = skills;
    }
    if (experience) {
      to_be_updated['experience'] = experience;
    }
    //console.log(to_be_updated);
    if (!to_be_updated) {
      throw new BadRequestException('Please enter either skills or experience');
    }

    const updatedProfile = await this.userModel
      .findOneAndUpdate(
        { _id: user._id },
        {
          skills: to_be_updated['skills'],
          experience: to_be_updated['experience'],
        },
        { new: true },
      )
      .select('-password');
    return updatedProfile;
  }
  public async getAllPostsofAllUser() {
    const pipelines = [
      {
        $lookup: {
          from: 'userposts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts',
        },
      },

      {
        $lookup: {
          from: 'comments',
          localField: 'posts._id',
          foreignField: 'from_post',
          as: 'posts.comments',
        },
      },

      {
        $project: {
          password: 0,
        },
      },
    ];
    return this.userModel.aggregate(pipelines);
  }
}
