import { Body, Controller, Post } from '@nestjs/common';
import { NewsletterService } from '../services/newsletter.service';
import { CreateSubscriberDto } from '../application/dto/create-subscriber.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Newsletter')
@Controller({ path: 'newsletter', version: '1' })
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe for the rivva platform newsletter' })
  subscribe(@Body() dto: CreateSubscriberDto) {
    return this.newsletterService.subscribe(dto.email);
  }
}
