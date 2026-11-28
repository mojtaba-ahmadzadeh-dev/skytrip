import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from '../../config/typeorm.config.js';
import { AuthModule } from '../auth/auth.module.js';
import { UserModule } from '../user/user.module.js';
import { RBACModule } from '../RBAC/rbac.module.js';
import { PassengerModule } from '../passenger/passenger.module.js';
import { CityModule } from '../city/city.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
    }),
    AuthModule,
    UserModule,
    RBACModule,
    PassengerModule,
    CityModule
  ],
})
export class AppModule {}