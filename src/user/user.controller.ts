import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { IUser } from './interfaces/user.interface';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/user.loginuser.dto';
import { UpdateSkillsAndExperienceDTO } from './dto/update_skills_and_experience.dto';
import { GetUser } from './decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from './accessToken.guard';
import { RefreshTokenGuard } from './refreshToken.guard';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  createUser(@Body() user: CreateUserDTO): Promise<IUser> {
    return this.userService.createUser(user);
  }

  @Post('/login')
  loginUser(
    @Body() user: LoginUserDTO,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.userService.loginUser(user);
  }
  @Get('/all-posts')
  getAllPosts() {
    return this.userService.getAllPostsofAllUser();
  }

  @Patch('/update')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  updateSkillsAndXp(
    @Body() updateSkillsAndXp: UpdateSkillsAndExperienceDTO,
    @GetUser() user: IUser,
  ) {
    return this.userService.updateSkillsAndExp(updateSkillsAndXp, user);
  }
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get('/logout')
  logout(@Req() req: Request) {
    return this.userService.logout(req);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth()
  @Get('/refresh')
  refresh(@Req() req: Request, @GetUser() user) {
    return this.userService.refreshTokens(
      user.attributes.username,
      user.refreshToken,
    );
  }
  ///test guard
  /*
  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log('GUARD WORKING ');
    console.log(req?.user);
    return {
      Authenticated: 'true',
    };
  }*/
}
