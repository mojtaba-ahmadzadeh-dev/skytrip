import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRbacDto {
  @ApiProperty({
    example: 'Manage Users',
    description: 'Permission name',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Permission for managing users',
    description: 'Permission description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class AssignPermissionDto {
  @ApiProperty({
    example: 1,
    description: 'Role ID',
  })
  @IsNumber()
  roleId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'List of permission IDs',
  })
  @IsArray()
  permissionIds: number[];
}

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'Role name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    example: 'Administrator role with full access',
    description: 'Role description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}

export class AssignRoleDto {
  @ApiProperty({
    example: 2,
    description: 'شناسه نقشی که باید به کاربر اختصاص داده شود',
  })
  @IsInt()
  @Min(1)
  roleId: number;
}