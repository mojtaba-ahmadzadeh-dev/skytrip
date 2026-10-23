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
import { LoginDto, RegisterDto } from '../dto/auth.dto.js';
import { AuthMessages } from '../../../common/enums/message.enum.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
