// src/shared/welcome/welcome.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class WelcomeService {
  private readonly appName = 'Rivva Campaign Management Service';
  private readonly version = '1.0.0'; // you can sync this with package.json if needed

  getWelcomeMessage(prefix?: string) {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        message: `🎉 Welcome to the ${this.appName} API!`,
        note: 'Base URL is ready for requests.',
        version: this.version,
        apiPrefix: prefix ?? 'api/v1',
      },
    };
  }
}
