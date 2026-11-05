import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/entities/user.entity.js';
import { JwtTokenService } from './token.service.js';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dto/auth.dto.js';
import { AuthMessages } from '../../../common/enums/message.enum.js';
import { Response } from 'express';
import { randomInt } from 'crypto';
import { OtpEntity } from '../../user/entities/otp.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async register(registerDto: RegisterDto) {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      username,
      password,
      confirmPassword,
    } = registerDto;

    this.validatePasswords(password, confirmPassword);

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPhone = phoneNumber.trim();

    await this.ensureUserDoesNotExist({
      email: normalizedEmail,
      username: normalizedUsername,
      phoneNumber: normalizedPhone,
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = this.userRepository.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: normalizedPhone,
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const tokens = await this.jwtTokenService.generateTokens(savedUser.id);

    return {
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        phoneNumber: savedUser.phoneNumber,
        email: savedUser.email,
        username: savedUser.username,
        createdAt: savedUser.createdAt,
      },
      ...tokens,
    };
  }
  async login(loginDto: LoginDto) {
    const identifier = loginDto.identifier.trim().toLowerCase();

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where(
        'LOWER(user.email) = :identifier OR LOWER(user.username) = :identifier',
        { identifier },
      )
      .getOne();

    if (!user) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(AuthMessages.INVALID_CREDENTIALS);
    }

    const tokens = await this.jwtTokenService.generateTokens(user.id);

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      ...tokens,
    };
  }
  async logout(userId: number, response: Response) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('کاربر پیدا نشد');
    }

    await this.userRepository.delete(userId);

    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'حساب کاربری با موفقیت حذف و خروج انجام شد',
    };
  }
  private validatePasswords(password: string, confirmPassword: string): void {
    if (password !== confirmPassword) {
      throw new UnprocessableEntityException(AuthMessages.PASSWORD_MISMATCH);
    }
  }
  private async ensureUserDoesNotExist(userData: {
    email: string;
    username: string;
    phoneNumber: string;
  }): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: userData.email },
        { username: userData.username },
        { phoneNumber: userData.phoneNumber },
      ],
      select: {
        id: true,
        email: true,
        username: true,
        phoneNumber: true,
      },
    });

    if (!existingUser) {
      return;
    }

    if (existingUser.email === userData.email) {
      throw new ConflictException(AuthMessages.EMAIL_ALREADY_EXISTS);
    }

    if (existingUser.username === userData.username) {
      throw new ConflictException(AuthMessages.USERNAME_ALREADY_EXISTS);
    }

    throw new ConflictException(AuthMessages.PHONE_ALREADY_EXISTS);
  }
  async verifyAccessToken(token: string) {
    try {
      return await this.jwtTokenService.verifyAccessToken(token);
    } catch {
      throw new UnauthorizedException('توکن نامعتبر یا منقضی شده است');
    }
  }
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const email = forgotPasswordDto.email.trim().toLowerCase();

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return {
        message:
          'اگر این ایمیل در سیستم ثبت شده باشد، کد بازیابی ارسال خواهد شد',
      };
    }

    // Generate a six-digit OTP
    const otpCode = randomInt(100000, 1000000).toString();

    // OTP expiration: 10 minutes
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let otp = await this.otpRepository.findOne({
      where: { userId: user.id },
    });

    if (otp) {
      otp.code = otpCode;
      otp.expiresIn = expiresAt;
      otp.method = 'email';
    } else {
      otp = this.otpRepository.create({
        userId: user.id,
        code: otpCode,
        expiresIn: expiresAt,
        method: 'email',
      });
    }

    await this.otpRepository.save(otp);

    return {
      message: 'کد بازیابی رمز عبور با موفقیت ایجاد شد',
      ...(process.env.NODE_ENV !== 'production' && {
        developmentOtp: otpCode,
      }),
    };
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const email = resetPasswordDto.email.trim().toLowerCase();

    this.validatePasswords(
      resetPasswordDto.newPassword,
      resetPasswordDto.confirmPassword,
    );

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('کد بازیابی نامعتبر است');
    }

    const otp = await this.otpRepository.findOne({
      where: { userId: user.id },
    });

    if (!otp) {
      throw new UnauthorizedException('کد بازیابی یافت نشد');
    }

    // Check OTP expiration
    if (otp.expiresIn.getTime() < Date.now()) {
      await this.otpRepository.delete(otp.id);

      throw new UnauthorizedException('کد بازیابی منقضی شده است');
    }

    // Compare plain OTP codes
    if (resetPasswordDto.code !== otp.code) {
      throw new UnauthorizedException('کد بازیابی نامعتبر است');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 12);

    user.password = hashedPassword;

    await this.userRepository.save(user);

    // Delete OTP after successful password reset
    await this.otpRepository.delete(otp.id);

    return {
      message: 'رمز عبور با موفقیت تغییر کرد',
    };
  }
}
