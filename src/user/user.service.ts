import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
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
  public async hashData(data: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedData = await bcrypt.hash(data, salt);
    return hashedData;
  }
  public async verifyHash(
    hash: string,
    originalData: string,
  ): Promise<boolean> {
    const result = await bcrypt.compare(originalData, hash);
    return result;
  }
  public async getTokens(username: string) {
    const payload: JWTPayload = { username };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET,
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }
  public async updateRefreshToken(username, refreshToken: string) {
    const hashRefreshToken = await this.hashData(refreshToken);
    await this.userModel.updateOne(
      { username: username },
      { refreshToken: hashRefreshToken },
    );
  }
  public async refreshTokens(username: string, refreshToken: string) {
    const user = await this.userModel.findOne({ username: username });
    console.log(user);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Something went wrong');
    }
    const isMatched = await this.verifyHash(user.refreshToken, refreshToken);
    if (isMatched) {
      const tokens = await this.getTokens(username);
      await this.updateRefreshToken(username, tokens.refreshToken);
      return tokens;
    } else {
      throw new ForbiddenException('Something went wrong');
    }
  }
  public async createUser(user: CreateUserDTO): Promise<IUser> {
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(user.password, salt);
    user.password = hashed_password;
    try {
      const tokens = await this.getTokens(user.username);
      user.refreshToken = tokens.refreshToken;
      const createdUser = await this.userModel.create(user);
      await this.updateRefreshToken(user.username, user.refreshToken);

      const santizedUser = await this.userModel
        .findOne({
          _id: createdUser._id,
        })
        .select('-password');
      ///console.log(sant
      return santizedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Username already exists.');
      } else {
        throw new InternalServerErrorException('Unknown error function');
      }
    }
  }
  public async loginUser(
    user: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const found_user = await this.userModel.find({ username: user.username });
    if (!found_user.length) {
      throw new NotFoundException('Username or password is wrong');
    }
    const verify = bcrypt.compare(found_user[0].password, user.password);
    if (!verify) {
      throw new NotFoundException('Username or password is wrong');
    } else {
      const username = found_user[0].username;
      //console.log(username);
      const { accessToken, refreshToken } = await this.getTokens(username);
      return {
        accessToken,
        refreshToken,
      };
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
  public async logout(req: Request) {
    return this.userModel.updateOne(
      { username: req['username'] },
      { refreshToken: null },
    );
  }
}
