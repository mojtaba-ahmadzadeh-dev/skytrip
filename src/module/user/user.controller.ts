import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('User')
class UserController {
  constructor(private readonly userService: UserService) {}
}

export default UserController;
