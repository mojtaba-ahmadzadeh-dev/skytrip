import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import { UserRepository } from '../../user/repository/user.repository.js';
import { RbacMessages } from '../../../common/enums/message.enum.js';
import { User } from '../../user/entities/user.entity.js';

interface JwtPayload {
  sub: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract access token.
    const accessToken = this.extractAccessToken(request);

    if (!accessToken) {
      throw new UnauthorizedException(RbacMessages.UNAUTHORIZED);
    }

    // Verify access token.
    const payload = await this.verifyAccessToken(accessToken);

    if (!payload.sub) {
      throw new UnauthorizedException(
        RbacMessages.INVALID_TOKEN_PAYLOAD,
      );
    }

    // Load user with role and permissions.
    const user = await this.findUserWithPermissions(payload.sub);

    if (!user) {
      throw new UnauthorizedException(RbacMessages.USER_NOT_FOUND);
    }

    // Attach authenticated user to request.
    request.user = user;

    // Super admin has full access.
    const roleName = user.role?.name?.trim().toLowerCase();

    if (roleName === 'super_admin') {
      return true;
    }

    // Get required permissions from decorator.
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    // Reject requests without required permissions.
    if (!requiredPermissions?.length) {
      throw new ForbiddenException(RbacMessages.FORBIDDEN);
    }

    // Check user's permissions.
    const userPermissions =
      user.role?.permissions?.map((permission) => permission.name) ?? [];

    const hasPermission = requiredPermissions.every((requiredPermission) =>
      userPermissions.includes(requiredPermission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(RbacMessages.FORBIDDEN);
    }

    return true;
  }

  private extractAccessToken(request: Request): string | undefined {
    const cookieToken = request.cookies?.access_token as string | undefined;

    if (cookieToken) {
      return cookieToken;
    }

    const authorization = request.headers.authorization;

    if (authorization?.startsWith('Bearer ')) {
      return authorization.substring(7);
    }

    return undefined;
  }

  private async verifyAccessToken(
    accessToken: string,
  ): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException(RbacMessages.INVALID_TOKEN);
    }
  }

  private async findUserWithPermissions(
    userId: number,
  ): Promise<User | null> {
    return this.userRepository.findUserWithPermissions(userId);
  }
}