import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TypeOrmDbConfig } from '../../config/typeorm.config.js';

import { AuthModule } from '../auth/auth.module.js';
import { UserModule } from '../user/user.module.js';
import { RBACModule } from '../RBAC/rbac.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),

    // ابتدا اتصال دیتابیس
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
    }),

    // سپس ماژول‌های وابسته به دیتابیس
    AuthModule,
    UserModule,
    RBACModule,
  ],
})
export class AppModule {}