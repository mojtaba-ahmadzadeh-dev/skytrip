
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmDbConfig } from '../../config/typeorm.config.js';
import { User } from '../user/entities/user.entity.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV ?? 'development'}`,
    }),
    AuthModule,

    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
    }),
  ],
})
export class AppModule {}
