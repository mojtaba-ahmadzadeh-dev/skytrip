import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CityService } from './city.service.js';
import { RbacGuard } from '../RBAC/guard/rbac.guard.js';
import { Permissions } from '../../common/decorator/permission.decorator.js';
import { PermissionsList } from '../../common/constants/permissions.constants.js';
import { CityQueryDto, CreateCityDto, UpdateCityDto } from './dto/city.dto.js';

@Controller('city')
@UseGuards(RbacGuard)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post('create')
  @Permissions(PermissionsList.CREATE_CITY)
  @ApiOperation({ summary: 'Create a new city' })
  create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto);
  }

  @Get('list')
  async findAll(@Query() dto: CityQueryDto) {
    return this.cityService.findAll(dto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.findOne(id);
  }

  @Patch('update/:id')
  @Permissions(PermissionsList.UPDATE_CITY)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCityDto,
  ) {
    return this.cityService.update(id, dto);
  }

  @Delete('remove/:id')
  @Permissions(PermissionsList.DELETE_CITY)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.remove(id);
  }

  @Patch('restore/:id')
  @Permissions(PermissionsList.RESTORE_CITY)
  async restore(@Param('id', ParseIntPipe) id: number) {
    return this.cityService.restore(id);
  }
}
