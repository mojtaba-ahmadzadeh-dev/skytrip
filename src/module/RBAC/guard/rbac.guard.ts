import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from '../../user/repository/user.repository.js';
import { RbacMessages } from '../../../common/enums/message.enum.js';
import { User } from '../../user/entities/user.entity.js';

interface JwtPayload {
  userId: number;
  // اگر فیلدهای دیگه‌ای هم داری اینجا اضافه کن
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<Request>();

    let accessToken = request.cookies?.access_token as string | undefined;
    if (!accessToken) {
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }

    if (!accessToken) {
      throw new UnauthorizedException(RbacMessages.UNAUTHORIZED);
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch (_error) {
      throw new UnauthorizedException(RbacMessages.INVALID_TOKEN);
    }

    const userId = payload.userId;
    if (!userId) {
      throw new UnauthorizedException(RbacMessages.INVALID_TOKEN_PAYLOAD);
    }

    const user = await this.findUserWithPermissions(userId);
    if (!user) {
      throw new UnauthorizedException(RbacMessages.USER_NOT_FOUND);
    }

    request.user = user;

    if (
      user.role?.name?.toLowerCase() === 'super_admin' ||
      user.role?.permissions?.some((permission) => permission.name === 'all')
    ) {
      return true;
    }

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = user.role?.permissions?.map((p) => p.name) || [];

    const hasAllPermissions = requiredPermissions.every((perm) =>
      userPermissions.includes(perm),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(
        `${RbacMessages.FORBIDDEN}: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }

  private async findUserWithPermissions(userId: number): Promise<User | null> {
    return this.userRepository.findUserWithPermissions(userId);
  }
}
