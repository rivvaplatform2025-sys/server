import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeAsset } from './domain/entities/creative-assets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreativeAsset])],
  exports: [TypeOrmModule],
})
export class AssetModule {}
