import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Not, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserMessages } from '../../common/enums/message.enum.js';
import {
  RequestEmailChangeDto,
  UpdateProfileDto,
  UpdateUserDto,
  UserQueryDto,
  VerifyEmailChangeDto,
} from './dto/user.dto.js';
import { randomInt } from 'crypto';
import { OtpEntity } from './entities/otp.entity.js';
import * as bcrypt from 'bcrypt';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
  ) {}

  async getMe() {
    const userId = this.getUserId();

    const user = await this.findUserOrFail(userId, {
      role: true,
    });

    return {
      message: UserMessages.USER_PROFILE_RETRIEVED,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role
          ? {
              id: user.role.id,
              name: user.role.name,
            }
          : null,
      },
    };
  }
  async updateMe(dto: UpdateProfileDto) {
    const userId = this.getUserId();

    const user = await this.findUserOrFail(userId);

    // Ensure at least one field is provided.
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(UserMessages.NO_PROFILE_CHANGES);
    }

    // Check whether the username is already used by another user.
    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: {
          username: dto.username,
        },
        select: {
          id: true,
        },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException(UserMessages.USERNAME_ALREADY_EXISTS);
      }
    }

    // Apply the allowed profile changes.
    Object.assign(user, dto);

    const updatedUser = await this.userRepository.save(user);

    // Return only public profile fields.
    return {
      message: UserMessages.USER_PROFILE_UPDATED,
      data: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phoneNumber: updatedUser.phoneNumber,
        email: updatedUser.email,
        username: updatedUser.username,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }
  async requestEmailChange(dto: RequestEmailChangeDto) {
    const userId = this.getUserId();

    const user = await this.findUserOrFail(userId);

    const newEmail = dto.email.trim().toLowerCase();

    if (newEmail === user.email.toLowerCase()) {
      throw new BadRequestException(UserMessages.EMAIL_SAME_AS_CURRENT);
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        email: newEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS);
    }

    const code = randomInt(100000, 1000000).toString();

    const expiresIn = new Date(Date.now() + 10 * 60 * 1000);

    let otp = await this.otpRepository.findOne({
      where: {
        userId,
      },
    });

    if (otp) {
      otp.code = code;
      otp.expiresIn = expiresIn;
      otp.method = 'change_email';
      otp.targetEmail = newEmail;
    } else {
      otp = this.otpRepository.create({
        userId,
        code,
        expiresIn,
        method: 'change_email',
        targetEmail: newEmail,
      });
    }

    await this.otpRepository.save(otp);

    return {
      message: UserMessages.EMAIL_CHANGE_OTP_SENT,
      data: {
        email: newEmail,
        expiresIn,
        ...(process.env.NODE_ENV !== 'production' && {
          developmentOtp: code,
        }),
      },
    };
  }
  async verifyEmailChange(dto: VerifyEmailChangeDto) {
    const userId = this.getUserId();

    const user = await this.findUserOrFail(userId);

    const otp = await this.otpRepository.findOne({
      where: {
        userId,
        method: 'change_email',
      },
    });

    if (!otp) {
      throw new NotFoundException(UserMessages.EMAIL_OTP_NOT_FOUND);
    }

    if (otp.expiresIn.getTime() <= Date.now()) {
      await this.otpRepository.remove(otp);

      throw new BadRequestException(UserMessages.EMAIL_OTP_EXPIRED);
    }

    if (otp.code !== dto.code) {
      throw new BadRequestException(UserMessages.EMAIL_OTP_INVALID);
    }

    if (!otp.targetEmail) {
      throw new BadRequestException(UserMessages.EMAIL_OTP_INVALID);
    }

    const existingUser = await this.userRepository.findOne({
      where: {
        email: otp.targetEmail,
      },
      select: {
        id: true,
      },
    });

    if (existingUser && existingUser.id !== userId) {
      throw new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS);
    }

    user.email = otp.targetEmail;

    const updatedUser = await this.userRepository.save(user);

    await this.otpRepository.remove(otp);

    return {
      message: UserMessages.EMAIL_CHANGE_SUCCESS,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }
  async findAll(dto: UserQueryDto) {
    const { page = 1, limit = 20, sortOrder = 'DESC' } = dto;

    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        role: {
          id: true,
          name: true,
        },
      },
      relations: {
        role: true,
      },
      skip,
      take: limit,
      order: {
        createdAt: sortOrder,
      },
    });

    return {
      message: 'Users retrieved successfully',
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }
  async findOne(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
        role: {
          id: true,
          name: true,
        },
      },
      relations: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }

    return {
      message: UserMessages.USER_RETRIEVED,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role
          ? {
              id: user.role.id,
              name: user.role.name,
            }
          : null,
      },
    };
  }
  async updateUser(userId: number, dto: UpdateUserDto) {
    const user = await this.findUserOrFail(userId);

    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(UserMessages.NO_PROFILE_CHANGES);
    }

    const email = dto.email?.trim().toLowerCase();
    const username = dto.username?.trim();
    const phoneNumber = dto.phoneNumber?.trim();

    // Check email uniqueness.
    if (email && email !== user.email.toLowerCase()) {
      const existingEmail = await this.userRepository.findOne({
        where: {
          email,
          id: Not(userId),
        },
        select: {
          id: true,
        },
      });

      if (existingEmail) {
        throw new ConflictException(UserMessages.EMAIL_ALREADY_EXISTS);
      }

      user.email = email;
    }

    // Check username uniqueness.
    if (username && username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: {
          username,
          id: Not(userId),
        },
        select: {
          id: true,
        },
      });

      if (existingUsername) {
        throw new ConflictException(UserMessages.USERNAME_ALREADY_EXISTS);
      }

      user.username = username;
    }

    // Check phone number uniqueness.
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const existingPhone = await this.userRepository.findOne({
        where: {
          phoneNumber,
          id: Not(userId),
        },
        select: {
          id: true,
        },
      });

      if (existingPhone) {
        throw new ConflictException(UserMessages.PHONE_ALREADY_EXISTS);
      }

      user.phoneNumber = phoneNumber;
    }

    // Update other profile fields.
    if (dto.firstName !== undefined) {
      user.firstName = dto.firstName;
    }

    if (dto.lastName !== undefined) {
      user.lastName = dto.lastName;
    }

    const updatedUser = await this.userRepository.save(user);

    return {
      message: UserMessages.USER_UPDATED,
      data: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }
  async toggleUserStatus(userId: number) {
    const adminId = this.getUserId();

    if (Number(adminId) === Number(userId)) {
      throw new BadRequestException(UserMessages.CANNOT_BAN_YOURSELF);
    }

    const user = await this.findUserOrFail(userId, {
      role: true,
    });

    if (
      ['superadmin', 'super_admin'].includes(user.role?.name?.toLowerCase())
    ) {
      throw new BadRequestException(
        UserMessages.CANNOT_CHANGE_SUPER_ADMIN_STATUS,
      );
    }

    user.isBanned = !user.isBanned;

    const updatedUser = await this.userRepository.save(user);

    return {
      message: updatedUser.isBanned
        ? UserMessages.USER_BANNED
        : UserMessages.USER_UNBANNED,
      data: {
        id: updatedUser.id,
        isBanned: updatedUser.isBanned,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }
  private async findUserOrFail(
    userId: number,
    relations?: FindOptionsRelations<User>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations,
    });

    if (!user) {
      throw new NotFoundException(UserMessages.USER_NOT_FOUND);
    }

    return user;
  }
  private getUserId() {
    const userId = this.request.user?.id;

    if (!userId) {
      throw new UnauthorizedException(UserMessages.USER_UNAUTHORIZED);
    }

    return userId;
  }
}
