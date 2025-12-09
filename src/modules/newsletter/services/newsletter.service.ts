import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from '../domain/entities/newsletter-subscriber.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(NewsletterSubscriber)
    private readonly subscriberRepo: Repository<NewsletterSubscriber>,
  ) {}

  async subscribe(email: string | null) {
    if (!email) throw new BadRequestException('Request body cannot be empty');
    // Check duplicate
    const existing = await this.subscriberRepo.findOne({ where: { email } });
    if (existing && existing.isVerified) {
      throw new ConflictException('Email already subscribed.');
    }
    if (existing) {
      throw new ConflictException('Email already subscribed but not verified.');
    }

    // Save subscriber
    const sub = this.subscriberRepo.create({ email, isVerified: true });
    await this.subscriberRepo.save(sub);

    // Optional: send welcome email or trigger double opt-in

    return { sub };
  }
}
