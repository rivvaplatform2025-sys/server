import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterSubscriber } from './domain/entities/newsletter-subscriber.entity';
import { NewsletterController } from './controllers/newsletter.controller';
import { NewsletterService } from './services/newsletter.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsletterSubscriber])],
  controllers: [NewsletterController],
  providers: [NewsletterService],
})
export class NewsletterModule {}
