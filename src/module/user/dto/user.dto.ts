import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    example: 'Mojtaba',
    description: 'نام کاربر',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Ahmadzadeh',
    description: 'نام خانوادگی کاربر',
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  lastName?: string;

  @ApiPropertyOptional({
    example: 'mojtaba_ah',
    description: 'نام کاربری جدید',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_.]+$/, {
    message:
      'نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد، نقطه و زیرخط باشد',
  })
  username?: string;
}

export class RequestEmailChangeDto {
  @ApiProperty({
    example: 'newemail@gmail.com',
    description: 'New email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyEmailChangeDto {
  @ApiProperty({
    example: '123456',
    description: 'Six-digit OTP code',
  })
  @IsString()
  @Length(6, 6)
  @IsNotEmpty()
  code: string;
}

export class UserQueryDto {
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
    description: 'Sort users by registration date',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Mojtaba',
    description: 'نام کاربر',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Ahmadzadeh',
    description: 'نام خانوادگی کاربر',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  lastName?: string;

  @ApiPropertyOptional({
    example: 'mojtaba_ah',
    description: 'نام کاربری',
  })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_.]+$/, {
    message:
      'نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد، نقطه و زیرخط باشد',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  username?: string;

  @ApiPropertyOptional({
    example: 'mojtaba@example.com',
    description: 'آدرس ایمیل کاربر',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email?: string;

  @ApiPropertyOptional({
    example: '09123456789',
    description: 'شماره تلفن کاربر',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[0-9]{10,20}$/, {
    message: 'شماره تلفن معتبر نیست',
  })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  phoneNumber?: string;
}