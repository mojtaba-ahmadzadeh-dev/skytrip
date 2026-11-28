import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, QueryFailedError, Repository } from 'typeorm';
import { City } from './entities/city.entity.js';
import { CityQueryDto, CreateCityDto, UpdateCityDto } from './dto/city.dto.js';
import { CityMessages } from '../../common/enums/message.enum.js';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(dto: CreateCityDto) {
    const existingCity = await this.cityRepository.findOne({
      where: {
        name: dto.name,
        province: dto.province,
      },
    });

    if (existingCity) {
      throw new ConflictException(CityMessages.CITY_ALREADY_EXISTS);
    }

    const city = this.cityRepository.create({
      ...dto,
      isActive: dto.isActive ?? true,
    });

    try {
      const savedCity = await this.cityRepository.save(city);

      return {
        message: CityMessages.CITY_CREATED,
        data: savedCity,
      };
    } catch (error) {
      // Handle duplicate records at database level as well
      if (
        error instanceof QueryFailedError &&
        error.driverError?.code === '23505'
      ) {
        throw new ConflictException(CityMessages.CITY_ALREADY_EXISTS);
      }

      throw error;
    }
  }
  async findAll(dto: CityQueryDto) {
    const { page = 1, limit = 20, search, sort = 'DESC' } = dto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.cityRepository.createQueryBuilder('city');

    if (search) {
      queryBuilder.where('city.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    queryBuilder.orderBy('city.id', sort).skip(skip).take(limit);

    const [cities, total] = await queryBuilder.getManyAndCount();

    return {
      data: cities,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findOne(id: number) {
    const city = await this.cityRepository.findOne({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException(CityMessages.NOT_FOUND);
    }

    return {
      data: city,
    };
  }
  async update(id: number, dto: UpdateCityDto) {
    const city = await this.cityRepository.findOne({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException(CityMessages.NOT_FOUND);
    }

    const name = dto.name ?? city.name;
    const province = dto.province ?? city.province;
    const country = dto.country ?? city.country;

    const duplicateCity = await this.cityRepository.findOne({
      where: {
        name,
        province,
        country,
        id: Not(id),
      },
    });

    if (duplicateCity) {
      throw new ConflictException(CityMessages.ALREADY_EXISTS);
    }

    this.cityRepository.merge(city, dto);

    const updatedCity = await this.cityRepository.save(city);

    return {
      message: CityMessages.UPDATED_SUCCESSFULLY,
      data: updatedCity,
    };
  }
  async remove(id: number) {
    const city = await this.cityRepository.findOne({
      where: { id },
    });

    if (!city) {
      throw new NotFoundException(CityMessages.NOT_FOUND);
    }

    await this.cityRepository.softDelete(id);

    return {
      message: CityMessages.CITY_DELETED,
    };
  }
  async restore(id: number) {
    const city = await this.cityRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!city) {
      throw new NotFoundException(CityMessages.NOT_FOUND);
    }

    if (!city.deletedAt) {
      throw new ConflictException(CityMessages.CITY_ALREADY_ACTIVE);
    }

    const existingCity = await this.cityRepository.findOne({
      where: {
        name: city.name,
        province: city.province,
        country: city.country,
      },
    });

    if (existingCity) {
      throw new ConflictException(CityMessages.CITY_ALREADY_EXISTS);
    }

    await this.cityRepository.restore(id);

    const restoredCity = await this.cityRepository.findOne({
      where: { id },
    });

    return {
      message: CityMessages.CITY_RESTORED,
      data: restoredCity,
    };
  }
}
