import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationToken } from './domain/entities/verification-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VerificationToken])],
  exports: [TypeOrmModule],
})
export class VerificationTokenModule {}
