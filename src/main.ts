import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './module/app/app.module.js';
import { SwaggerConfigInit } from './config/swagger.config.js';
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  SwaggerConfigInit(app);
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, () => {
    console.log(`http://localhost:${port}`);
    console.log(`swagger: http://localhost:${port}/swagger`);
  });
}
bootstrap();
