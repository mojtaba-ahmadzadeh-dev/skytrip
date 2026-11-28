import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

import { PassengerGender } from '../enum/passenger.enum.js';

export class CreatePassengerDto {
  @ApiProperty({ example: 'Mojtaba', description: 'نام مسافر' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(2, 100)
  firstName: string;

  @ApiProperty({ example: 'Ahmadzadeh', description: 'نام خانوادگی مسافر' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(2, 100)
  lastName: string;

  @ApiProperty({
    example: '2004-05-15',
    description: 'تاریخ تولد با فرمت YYYY-MM-DD',
  })
  @IsDateString({ strict: true })
  birthDate: string;

  @ApiProperty({
    enum: PassengerGender,
    example: PassengerGender.MALE,
  })
  @IsEnum(PassengerGender)
  gender: PassengerGender;

  @ApiProperty({
    example: '0123456789',
    description: 'کد ملی مسافر',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @Length(1, 30)
  nationalCode: string;

  @ApiPropertyOptional({
    example: 'A12345678',
    description: 'شماره پاسپورت',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(50)
  passportNumber?: string | null;

  @ApiPropertyOptional({
    example: 'Iranian',
    description: 'ملیت مسافر',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(100)
  nationality?: string | null;
}

export class PassengerQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @ApiPropertyOptional({
    example: 'Mojtaba',
    description: 'جست‌وجو بر اساس نام، نام خانوادگی، کد ملی یا شماره پاسپورت',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    description: 'ASC قدیمی‌ترین، DESC جدیدترین',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}

export class UpdatePassengerDto extends PartialType(CreatePassengerDto) {}