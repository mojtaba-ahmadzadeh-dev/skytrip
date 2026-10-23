
import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/auth.dto.js';
import { User } from '../user/entities/user.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

    if (password !== confirmPassword) {
      throw new UnprocessableEntityException(
        'کلمه عبور و تکرار آن مطابقت ندارند',
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedPhone = phoneNumber.trim();

    const existingUser = await this.userRepository.findOne({
      where: [
        { email: normalizedEmail },
        { username: normalizedUsername },
        { phoneNumber: normalizedPhone },
      ],
      select: {
        id: true,
        email: true,
        username: true,
        phoneNumber: true,
      },
    });

    if (existingUser) {
      const duplicateUser = await this.userRepository.findOne({
        where: [
          { email: normalizedEmail },
          { username: normalizedUsername },
          { phoneNumber: normalizedPhone },
        ],
      });

      if (duplicateUser?.email === normalizedEmail) {
        throw new ConflictException('این ایمیل قبلاً ثبت شده است');
      }

      if (duplicateUser?.username === normalizedUsername) {
        throw new ConflictException(
          'این نام کاربری در دسترس نمی‌باشد',
        );
      }

      throw new ConflictException(
        'این شماره تلفن قبلاً ثبت شده است',
      );
    }

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

    return {
      message: 'ثبت‌نام با موفقیت انجام شد',
      data: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        phoneNumber: savedUser.phoneNumber,
        email: savedUser.email,
        username: savedUser.username,
        createdAt: savedUser.createdAt,
      },
    };
  }
}
