import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller({ path: 'api/v1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getWelcome(): { message: string } {
    return {
      message: `🎉 Welcome to the Rivva Service API Platform! Base URL is ready. Visit the documentation url: https://rivva-server.onrender.com/docs for more information.`,
    };
  }
}
