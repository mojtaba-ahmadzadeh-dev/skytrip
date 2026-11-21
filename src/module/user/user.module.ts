import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { OtpEntity } from '../user/entities/otp.entity.js';
import UserController from './user.controller.js';
import { UserService } from './user.service.js';
import { RoleEntity } from '../RBAC/entities/role.entity.js';
import { PermissionEntity } from '../RBAC/entities/permission.entity.js';
import { UserRepository } from './repository/user.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, OtpEntity, RoleEntity, PermissionEntity]), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
