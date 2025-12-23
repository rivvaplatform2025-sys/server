import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Platform } from './domain/entities/platform.entity';
import { PlatformQueryService } from './services/platform-query.service';
import { PlatformManagerController } from './controllers/platform-manager.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Platform])],
  providers: [PlatformQueryService],
  controllers: [PlatformManagerController],
  exports: [TypeOrmModule],
})
export class PlatformModule {}
