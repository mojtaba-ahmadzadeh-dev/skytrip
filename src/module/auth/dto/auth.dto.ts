import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Mojtaba',
    description: 'نام کاربر',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;
  @ApiProperty({
    example: 'Ahmadzadeh',
    description: 'نام خانوادگی کاربر',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;
  @ApiProperty({
    example: '09123456789',
    description: 'شماره موبایل کاربر',
  })
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'شماره تلفن معتبر نیست',
  })
  phoneNumber: string;
  @ApiProperty({
    example: 'mojtaba@example.com',
    description: 'آدرس ایمیل کاربر',
  })
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'mojtaba123',
    description: 'نام کاربری',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9]+$/, {
    message: 'نام کاربری فقط می‌تواند شامل حروف کوچک انگلیسی و اعداد باشد',
  })
  username: string;
  @ApiProperty({
    example: 'Mojtaba@123',
    description: 'رمز عبور (حداقل ۸ کاراکتر)',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
  @ApiProperty({
    example: 'Mojtaba@123',
    description: 'تکرار رمز عبور',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'mojtaba@example.com',
    description: 'ایمیل یا نام کاربری',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    example: 'Mojtaba@123',
    description: 'رمز عبور',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'mojtaba@example.com',
    description: 'ایمیل ثبت‌شده کاربر',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    example: 'mojtaba@example.com',
    description: 'ایمیل حساب کاربری',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'کد ۶ رقمی ارسال‌شده به ایمیل',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  code: string;

  @ApiProperty({
    example: 'NewPassword123',
    description: 'رمز عبور جدید',
  })
  @IsString()
  @MinLength(8)
  newPassword: string;

  @ApiProperty({
    example: 'NewPassword123',
    description: 'تکرار رمز عبور جدید',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}