import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Passenger } from './entities/passenger.entity.js';
import { PassengerController } from './passenger.controller.js';
import { PassengerService } from './passenger.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Passenger]),
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [PassengerController],
  providers: [PassengerService],
})
export class PassengerModule {}