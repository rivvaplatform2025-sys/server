// src/common/security/rate-limit.factory.ts
import { Injectable } from '@nestjs/common';
import { rateLimit } from 'express-rate-limit';
import type {
  RateLimitRequestHandler,
  Options as RateLimitOptions,
} from 'express-rate-limit';

@Injectable()
export class RateLimitFactory {
  create(options?: Partial<RateLimitOptions>): RateLimitRequestHandler {
    const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
    const max = Number(process.env.RATE_LIMIT_MAX || 100);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return rateLimit({
      windowMs,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      ...options,
    }) as RateLimitRequestHandler; // <-- fully typed
  }
}
