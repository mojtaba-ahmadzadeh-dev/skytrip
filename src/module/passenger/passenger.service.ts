import { InjectRepository } from '@nestjs/typeorm';
import { Passenger } from './entities/passenger.entity.js';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  CreatePassengerDto,
  PassengerQueryDto,
  UpdatePassengerDto,
} from './dto/passenger.dto.js';
import type { Request } from 'express';
import { PassengerMessages } from '../../common/enums/message.enum.js';

@Injectable({ scope: Scope.REQUEST })
export class PassengerService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepository: Repository<Passenger>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async create(dto: CreatePassengerDto) {
    const userId = this.getUserId();

    const birthDate = new Date(`${dto.birthDate}T00:00:00.000Z`);

    if (birthDate.getTime() > Date.now()) {
      throw new BadRequestException(
        PassengerMessages.BIRTH_DATE_CANNOT_BE_FUTURE,
      );
    }

    const passenger = this.passengerRepository.create({
      ...dto,
      birthDate,
      userId,
    });

    const savedPassenger = await this.passengerRepository.save(passenger);

    return {
      message: PassengerMessages.PASSENGER_CREATED,
      data: savedPassenger,
    };
  }
  async findAll(dto: PassengerQueryDto) {
    const userId = this.getUserId();

    const { page = 1, limit = 20, search, sortOrder = 'DESC' } = dto;

    const queryBuilder = this.passengerRepository
      .createQueryBuilder('passenger')
      .where('passenger.userId = :userId', { userId });

    if (search) {
      queryBuilder.andWhere(
        `(
        passenger.firstName ILIKE :search OR
        passenger.lastName ILIKE :search OR
        passenger.nationalCode ILIKE :search OR
        passenger.passportNumber ILIKE :search
      )`,
        { search: `%${search}%` },
      );
    }

    const [passengers, total] = await queryBuilder
      .orderBy('passenger.id', sortOrder)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      message: PassengerMessages.PASSENGERS_RETRIEVED,
      data: passengers,
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
  async findOne(id: number) {
    const userId = this.getUserId();

    const passenger = await this.passengerRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!passenger) {
      throw new NotFoundException(PassengerMessages.PASSENGER_NOT_FOUND);
    }

    return {
      message: PassengerMessages.PASSENGER_RETRIEVED,
      data: passenger,
    };
  }
  async update(id: number, dto: UpdatePassengerDto) {
    const userId = this.getUserId();

    // Check empty request body
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException(PassengerMessages.NO_PASSENGER_CHANGES);
    }

    // Find passenger by ID and owner
    const passenger = await this.passengerRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!passenger) {
      throw new NotFoundException(PassengerMessages.PASSENGER_NOT_FOUND);
    }

    // Prevent null values for required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'birthDate',
      'gender',
      'nationalCode',
    ] as const;

    for (const field of requiredFields) {
      if (dto[field] === null) {
        throw new BadRequestException(PassengerMessages.INVALID_PASSENGER_DATA);
      }
    }

    // Validate birth date
    if (dto.birthDate) {
      const birthDate = new Date(`${dto.birthDate}T00:00:00.000Z`);

      if (birthDate.getTime() > Date.now()) {
        throw new BadRequestException(
          PassengerMessages.BIRTH_DATE_CANNOT_BE_FUTURE,
        );
      }

      passenger.birthDate = birthDate;
    }

    // Update allowed fields
    const { birthDate, ...updateData } = dto;

    Object.assign(passenger, updateData);

    const updatedPassenger = await this.passengerRepository.save(passenger);

    return {
      message: PassengerMessages.PASSENGER_UPDATED,
      data: updatedPassenger,
    };
  }
  async remove(id: number) {
    const userId = this.getUserId();

    // Find passenger by ID and owner
    const passenger = await this.passengerRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!passenger) {
      throw new NotFoundException(PassengerMessages.PASSENGER_NOT_FOUND);
    }

    // Soft delete passenger
    await this.passengerRepository.softDelete({
      id,
      userId,
    });

    return {
      message: PassengerMessages.PASSENGER_DELETED,
    };
  }
  async restore(id: number) {
    const userId = this.getUserId();

    // Find passenger including soft-deleted records
    const passenger = await this.passengerRepository.findOne({
      where: {
        id,
        userId,
      },
      withDeleted: true,
    });

    if (!passenger) {
      throw new NotFoundException(PassengerMessages.PASSENGER_NOT_FOUND);
    }

    // Check whether passenger is already active
    if (!passenger.deletedAt) {
      throw new BadRequestException(PassengerMessages.PASSENGER_ALREADY_ACTIVE);
    }

    // Restore soft-deleted passenger
    await this.passengerRepository.restore({
      id,
      userId,
    });

    const restoredPassenger = await this.passengerRepository.findOne({
      where: {
        id,
        userId,
      },
    });

    return {
      message: PassengerMessages.PASSENGER_RESTORED,
      data: restoredPassenger,
    };
  }
  private getUserId(): number {
    const userId = this.request.user?.id;

    if (!userId) {
      throw new UnauthorizedException(PassengerMessages.USER_UNAUTHORIZED);
    }

    return userId;
  }
}
