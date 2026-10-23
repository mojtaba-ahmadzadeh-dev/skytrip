import { Module } from '@nestjs/common';
import AuthController from './auth.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service.js';
import { JwtTokenService } from './service/token.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtTokenService],
  exports: [AuthService],
})
export class AuthModule {}
