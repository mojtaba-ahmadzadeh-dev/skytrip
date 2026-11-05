import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthMessages } from '../../../common/enums/message.enum.js';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(userId: string | number) {
    const accessSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');

    const refreshSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );

    if (!accessSecret || !refreshSecret) {
      throw new InternalServerErrorException(
        AuthMessages.TOKEN_CONFIGURATION_ERROR,
      );
    }

    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: accessSecret,
        expiresIn: '15m',
      }),

      this.jwtService.signAsync(payload, {
        secret: refreshSecret,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
  async verifyAccessToken(token: string) {
    const accessSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');

    if (!accessSecret) {
      throw new InternalServerErrorException(
        AuthMessages.TOKEN_CONFIGURATION_ERROR,
      );
    }

    return this.jwtService.verifyAsync(token, {
      secret: accessSecret,
    });
  }
  async generatePasswordResetToken(userId: number) {
    const secret = this.configService.get<string>(
      'PASSWORD_RESET_TOKEN_SECRET',
    );

    if (!secret) {
      throw new InternalServerErrorException(
        AuthMessages.TOKEN_CONFIGURATION_ERROR,
      );
    }

    return this.jwtService.signAsync(
      {
        sub: userId,
        purpose: 'password-reset',
      },
      {
        secret,
        expiresIn: '15m',
      },
    );
  }
  async verifyPasswordResetToken(token: string) {
    const secret = this.configService.get<string>(
      'PASSWORD_RESET_TOKEN_SECRET',
    );

    if (!secret) {
      throw new InternalServerErrorException(
        AuthMessages.TOKEN_CONFIGURATION_ERROR,
      );
    }

    const payload = await this.jwtService.verifyAsync<{
      sub: number;
      purpose: string;
    }>(token, { secret });

    if (payload.purpose !== 'password-reset' || !payload.sub) {
      throw new UnauthorizedException('توکن بازیابی معتبر نیست');
    }

    return payload;
  }
}
