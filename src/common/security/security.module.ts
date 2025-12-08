import { Module, Global } from '@nestjs/common';
import { HelmetModule } from './helmet.module';
//import { RateLimitFactory } from './rate-limit.factory';

@Global()
@Module({
  imports: [HelmetModule],
  exports: [HelmetModule],
  // providers: [RateLimitFactory],
  // exports: [HelmetModule, RateLimitFactory],
})
export class SecurityModule {}
