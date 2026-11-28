import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { City } from './entities/city.entity.js';
import { CityController } from './city.controller.js';
import { CityService } from './city.service.js';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([City]), UserModule],
  controllers: [CityController],
  providers: [CityService, JwtService],
  exports: [CityService],
})
export class CityModule {}