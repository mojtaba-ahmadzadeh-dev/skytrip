import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleEntity } from './entities/role.entity.js';
import { PermissionEntity } from './entities/permission.entity.js';

import { RbacController } from './rbac.controller.js';

import { User } from '../user/entities/user.entity.js';
import { UserRepository } from '../user/repository/user.repository.js';
import { JwtService } from '@nestjs/jwt';
import { RbacSeedService } from './service/rbac-seed.service.js';
import { RbacService } from './service/rbac.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      User,
    ]),
  ],
  controllers: [RbacController],
  providers: [
    RbacService,
    RbacSeedService,
    UserRepository,
    JwtService
  ],
  exports: [RbacService],
})
export class RBACModule {}