import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerConfig } from './shared/swagger/swagger.options';
//import { HelmetModule } from './common/security/helmet.module';
//import { RateLimitFactory } from './common/security/rate-limit.factory';
//import cookieParser from 'cookie-parser';
//import { HelmetModule } from './common/security/helmet.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: {
      origin: '*', // or specify your frontend URL
      methods: 'GET,POST,PUT,DELETE',
      credentials: true,
    },
  });

  // Prefix and versioning
  // app.setGlobalPrefix('api');
  // app.enableVersioning({
  //   type: VersioningType.URI,
  //   defaultVersion: '1',
  // });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip non-decorated properties
      forbidNonWhitelisted: false, // optionally true to throw on unknown props
      transform: true, // auto-transform primitives
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  // ---- Cookie Parser ----
  //app.use(cookieParser());

  // Use helmet from your module
  // const helmet = app.get(HelmetModule);
  // app.use(helmet);

  // -----------------------------
  // GLOBAL MIDDLEWARE & SECURITY
  // -----------------------------
  // ---- Global Rate Limiting ----
  // Fully typed rate limit
  // const rateLimitFactory = app.get(RateLimitFactory);
  // const rateLimiter = rateLimitFactory.create();
  // app.use(rateLimiter);

  // -----------------------------
  // GLOBAL INTERCEPTORS & FILTERS
  // -----------------------------
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger (only enabled in non-production by default)
  SwaggerConfig.setup(app);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
  logger.log(`🚀 Application running on http://localhost:${port}`);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
