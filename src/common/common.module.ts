import { Global, Module } from '@nestjs/common';
import { SlugService } from './helpers/slug';

@Global()
@Module({
  providers: [SlugService],
  exports: [SlugService],
})
export class CommonModule {}
