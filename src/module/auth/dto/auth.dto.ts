import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;
  @ApiProperty()
  @IsString()
  @Matches(/^09\d{9}$/, {
    message: 'شماره تلفن معتبر نیست',
  })
  phoneNumber: string;
  @ApiProperty()
  @IsEmail({}, { message: 'ایمیل معتبر نیست' })
  @MaxLength(255)
  email: string;
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-z0-9]+$/, {
    message: 'نام کاربری فقط می‌تواند شامل حروف کوچک انگلیسی و اعداد باشد',
  })
  username: string;
  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
