import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './domain/entities/platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Platform])],
  exports: [TypeOrmModule],
})
export class RPlatformModule {}
