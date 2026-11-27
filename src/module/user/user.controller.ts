import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { RbacGuard } from '../RBAC/guard/rbac.guard.js';
import { Permissions } from '../../common/decorator/permission.decorator.js';
import { PermissionsList } from '../../common/constants/permissions.constants.js';
import {
  RequestEmailChangeDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserQueryDto,
  VerifyEmailChangeDto,
} from './dto/user.dto.js';

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

  @Get('/all')
  @Permissions(PermissionsList.FIND_USERS)
  findAll(@Query() dto: UserQueryDto) {
    return this.userService.findAll(dto);
  }

  @Get(':id')
  @Permissions(PermissionsList.FIND_ONE_USER)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get(':id/toggle-status')
  @Permissions(PermissionsList.MANAGE_USER_STATUS)
  toggleUserStatus(@Param('id', ParseIntPipe) id: number) {
    return this.userService.toggleUserStatus(id);
  }

  @Patch(':id')
  @Permissions(PermissionsList.UPDATE_USER)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }
}

export default UserController;
