import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import AuthController from './auth.controller.js';
import { AuthService } from './service/auth.service.js';
import { JwtTokenService } from './service/token.service.js';

import { User } from '../user/entities/user.entity.js';
import { OtpEntity } from '../user/entities/otp.entity.js';
import { RoleEntity } from '../RBAC/entities/role.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, OtpEntity, RoleEntity]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService],
  exports: [AuthService],
})
export class AuthModule {}