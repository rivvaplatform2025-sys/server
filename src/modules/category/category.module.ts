import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryType } from './domain/entities/category-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryType])],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
