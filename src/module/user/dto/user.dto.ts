import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
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
    message: 'نام کاربری فقط می‌تواند شامل حروف انگلیسی، عدد، نقطه و زیرخط باشد',
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