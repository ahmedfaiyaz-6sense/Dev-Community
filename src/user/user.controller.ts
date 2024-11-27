import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.createuser.dto';
import { User } from './user.schema';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post()
  createUser(@Body() user: CreateUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }
}
