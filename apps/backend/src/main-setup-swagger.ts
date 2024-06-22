import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import process from 'node:process';
import { Logger } from '@nestjs/common';

export function setupSwagger(app: NestExpressApplication) {
  const globalPrefix = process.env.API_PREFIX || 'api';
  const swaggerPath = process.env.SWAGGER_PATH || 'swagger';
  const port = process.env.PORT || 3333;

  // setup swagger
  const swaggerDocumentConfig = new DocumentBuilder()
    .setTitle('Jellyblog')
    .setDescription('Jellyblog web API')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerDocumentConfig);
  SwaggerModule.setup(`${globalPrefix}/${swaggerPath}`, app, swaggerDocument);

  Logger.log(`Swagger lintening at http://localhost:${port}/${globalPrefix}/${swaggerPath}`)
  return app;
}
