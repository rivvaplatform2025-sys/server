import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';

let cachedServer: Promise<Express> | null = null;

async function bootstrapServer(): Promise<Express> {
  if (!cachedServer) {
    cachedServer = (async () => {
      const server = express();
      const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(server),
        {
          logger: false,
        },
      );
      await app.init();

      return server;
    })();
  }

  return cachedServer;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const server = await bootstrapServer();
  server(req, res);
}

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
// import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// import { ResponseInterceptor } from './common/interceptors/response.interceptor';
// import { SwaggerConfig } from './shared/swagger/swagger.options';
// //import { RateLimitFactory } from './common/security/rate-limit.factory';
// //import cookieParser from 'cookie-parser';
// //import { HelmetModule } from './common/security/helmet.module';

// async function bootstrap() {
//   const logger = new Logger('Bootstrap');

//   if (process.env.VERCEL === '1') {
//     return;
//   }

//   const app = await NestFactory.create(AppModule, { bufferLogs: true });

//   // Prefix and versioning
//   app.setGlobalPrefix('api');
//   app.enableVersioning({
//     type: VersioningType.URI,
//     defaultVersion: '1',
//   });

//   // Global validation
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // strip non-decorated properties
//       forbidNonWhitelisted: false, // optionally true to throw on unknown props
//       transform: true, // auto-transform primitives
//       transformOptions: { enableImplicitConversion: true },
//       stopAtFirstError: true,
//     }),
//   );

//   // ---- Cookie Parser ----
//   //app.use(cookieParser());

//   // Use helmet from your module
//   // const helmet = app.get(HelmetModule);
//   // app.use(helmet);

//   // -----------------------------
//   // GLOBAL MIDDLEWARE & SECURITY
//   // -----------------------------
//   // ---- Global Rate Limiting ----
//   // Fully typed rate limit
//   // const rateLimitFactory = app.get(RateLimitFactory);
//   // const rateLimiter = rateLimitFactory.create();
//   // app.use(rateLimiter);

//   // -----------------------------
//   // GLOBAL INTERCEPTORS & FILTERS
//   // -----------------------------
//   app.useGlobalFilters(new HttpExceptionFilter());
//   app.useGlobalInterceptors(new ResponseInterceptor());

//   // Swagger (only enabled in non-production by default)
//   if (process.env.NODE_ENV !== 'production') {
//     SwaggerConfig.setup(app);
//   }

//   const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
//   await app.listen(port);
//   logger.log(`🚀 Application running on http://localhost:${port}/api/v1`);
// }
// bootstrap().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
