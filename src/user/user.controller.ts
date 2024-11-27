import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/user.loginuser.dto';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/signup')
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }

  @Post('/login')
  loginUser(@Body() user: LoginUserDTO): Promise<User> {
    return this.userService.loginUser(user);
  }
}
