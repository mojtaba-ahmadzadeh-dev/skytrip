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
import { FindOptionsRelations, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { UserMessages } from '../../common/enums/message.enum.js';
import { UpdateProfileDto } from './dto/user.dto.js';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
