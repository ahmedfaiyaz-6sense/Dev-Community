import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/user.loginuser.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }

  @Post('/login')
  loginUser(@Body() user: LoginUserDTO): Promise<{ access_token: string }> {
    return this.userService.loginUser(user);
  }

  ///test guard
  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log('GUARD WORKING: ');
    //console.log(req);
  }
}
