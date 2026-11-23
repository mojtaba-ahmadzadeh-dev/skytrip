import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service.js';
import { RbacGuard } from '../RBAC/guard/rbac.guard.js';
import { Permissions } from '../../common/decorator/permission.decorator.js';
import { PermissionsList } from '../../common/constants/permissions.constants.js';
import { UpdateProfileDto } from './dto/user.dto.js';

@Controller('user')
@UseGuards(RbacGuard)
class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  getMe() {
    return this.userService.getMe();
  }

  @Put('me/update')
  @Permissions(PermissionsList.UPDATE_MY_PROFILE)
  updateMe(@Body() dto: UpdateProfileDto) {
    return this.userService.updateMe(dto);
  }
}

export default UserController;
