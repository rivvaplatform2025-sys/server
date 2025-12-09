// src/common/security/helmet.helper.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import helmet, { HelmetOptions } from 'helmet';
import { RequestHandler } from 'express';

@Module({})
export class HelmetModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const helmetMiddleware = helmet({
      // Customize security headers here
      xFrameOptions: { action: 'deny' },
      contentSecurityPolicy: false, // enable later if needed
    } as HelmetOptions) as unknown as RequestHandler;

    consumer.apply(helmetMiddleware).forRoutes('*');
  }
}
