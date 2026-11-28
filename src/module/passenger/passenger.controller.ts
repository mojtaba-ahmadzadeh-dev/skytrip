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
import { PassengerService } from './passenger.service.js';
import { Permissions } from '../../common/decorator/permission.decorator.js';
import { PermissionsList } from '../../common/constants/permissions.constants.js';
import {
  CreatePassengerDto,
  PassengerQueryDto,
  UpdatePassengerDto,
} from './dto/passenger.dto.js';
import { RbacGuard } from '../RBAC/guard/rbac.guard.js';

@Controller('passenger')
@UseGuards(RbacGuard)
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post('create')
  @Permissions(PermissionsList.CREATE_PASSENGER)
  create(@Body() dto: CreatePassengerDto) {
    return this.passengerService.create(dto);
  }

  @Get('list')
  @Permissions(PermissionsList.FIND_PASSENGERS)
  findAll(@Query() dto: PassengerQueryDto) {
    return this.passengerService.findAll(dto);
  }

  @Get(':id')
  @Permissions(PermissionsList.FIND_PASSENGERS)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.passengerService.findOne(id);
  }

  @Patch('update/:id')
  @Permissions(PermissionsList.UPDATE_PASSENGER)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePassengerDto,
  ) {
    return this.passengerService.update(id, dto);
  }

  @Delete('remove/:id')
  @Permissions(PermissionsList.DELETE_PASSENGER)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.passengerService.remove(id);
  }

  @Patch('restore/:id')
  @Permissions(PermissionsList.RESTORE_PASSENGER)
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.passengerService.restore(id);
  }
}
