import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { RbacGuard } from '../RBAC/guard/rbac.guard.js';
import { Permissions } from '../../common/decorator/permission.decorator.js';
import { PermissionsList } from '../../common/constants/permissions.constants.js';
import { RequestEmailChangeDto, UpdateProfileDto, VerifyEmailChangeDto } from './dto/user.dto.js';

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

  @Post('me/email/request-otp')
  @Permissions(PermissionsList.UPDATE_MY_PROFILE)
  requestEmailChange(@Body() dto: RequestEmailChangeDto) {
    return this.userService.requestEmailChange(dto);
  }

  @Patch('me/email/verify')
  @Permissions(PermissionsList.UPDATE_MY_PROFILE)
  verifyEmailChange(@Body() dto: VerifyEmailChangeDto) {
    return this.userService.verifyEmailChange(dto);
  }
}

export default UserController;
