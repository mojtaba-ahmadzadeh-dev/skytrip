import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { Permissions } from '../../common/decorator/permission.decorator.js';
import { PermissionsList } from '../../common/constants/permissions.constants.js';
import { RbacGuard } from './guard/rbac.guard.js';
import { AssignRoleDto, CreateRbacDto, CreateRoleDto } from './dto/rbac.dto.js';
import { RbacService } from './service/rbac.service.js';

@Controller('rbac')
@ApiTags('RBAC')
@UseGuards(RbacGuard)
export class RbacController {
  constructor(private rbacService: RbacService) {}

  @Post('roles')
  @Permissions(PermissionsList.CREATE_ROLE)
  createRole(@Body() dto: CreateRoleDto) {
    return this.rbacService.createRole(dto);
  }

  @Get('permissions')
  getAllPermissions() {
    return this.rbacService.findAllPermissions();
  }

  @Get('roles')
  getAllRoles() {
    return this.rbacService.getAllRoles();
  }

  @Get('roles/:id')
  getRoleById(@Param('id') id: number) {
    return this.rbacService.getRoleById(id);
  }

  @Post('roles/:roleId/permissions/:permissionId')
  assignPermissionToRole(
    @Param('roleId') roleId: number,
    @Param('permissionId') permissionId: number,
  ) {
    return this.rbacService.assignPermissionToRole(roleId, permissionId);
  }

  @Post('permissions')
  @Permissions(PermissionsList.CREATE_PERMISSION)
  createPermission(@Body() dto: CreateRbacDto) {
    return this.rbacService.createPermission(dto);
  }

  @Delete('role/:id')
  deleteRole(@Param('id') id: number) {
    return this.rbacService.deleteRole(id);
  }

  @Patch('users/:userId/role')
  assignRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: AssignRoleDto,
  ) {
    return this.rbacService.assignRoleToUser(userId, dto.roleId);
  }
}
