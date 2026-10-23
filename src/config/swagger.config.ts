import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerConfigInit(app: INestApplication): void {
  const document = new DocumentBuilder()
    .setTitle('SkyTrip')
    .setDescription('Backend API of SkyTrip flight ticket sales platform')
    .setVersion('v1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Authorization',
    )
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, document);

  SwaggerModule.setup('/swagger', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
