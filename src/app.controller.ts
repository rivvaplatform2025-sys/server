import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Root')
@Controller({ path: 'api/v1' })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Welcome message for the Rivva Service Platform',
  })
  getWelcome(): { message: string } {
    return {
      message: `🎉 Welcome to the Rivva Service API Platform! Base URL is ready. Visit the documentation url: https://rivva-server.onrender.com/docs for more information.`,
    };
  }
}
