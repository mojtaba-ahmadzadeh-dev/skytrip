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
  sub: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Extract access token from cookie or Authorization header
    const accessToken = this.extractAccessToken(request);

    if (!accessToken) {
      throw new UnauthorizedException(RbacMessages.UNAUTHORIZED);
    }

    // Verify JWT access token
    const payload = await this.verifyAccessToken(accessToken);

    // Validate user ID
    const userId = payload.sub;

    if (!userId) {
      throw new UnauthorizedException(RbacMessages.INVALID_TOKEN_PAYLOAD);
    }

    // Find user with role and permissions
    const user = await this.findUserWithPermissions(userId);

    if (!user) {
      throw new UnauthorizedException(RbacMessages.USER_NOT_FOUND);
    }

    // Attach authenticated user to request
    request.user = user;

    // Only super_admin can access RBAC endpoints
    this.validateSuperAdminAccess(user);

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

  private async verifyAccessToken(accessToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      });
    } catch {
      throw new UnauthorizedException(RbacMessages.INVALID_TOKEN);
    }
  }

  private async findUserWithPermissions(userId: number): Promise<User | null> {
    return this.userRepository.findUserWithPermissions(userId);
  }

  private validateSuperAdminAccess(user: User): void {
    const roleName = user.role?.name?.trim().toLowerCase();

    if (roleName !== 'super_admin') {
      throw new ForbiddenException(RbacMessages.FORBIDDEN);
    }
  }
}
