// shared/swagger/swagger.options.ts

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig {
  static setup(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('Auto-generated Swagger OpenAPI documentation')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      })
      .addCookieAuth('access_token')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('/docs', app, document, {
      jsonDocumentUrl: '/docs/json',
      yamlDocumentUrl: '/docs/yaml',
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
