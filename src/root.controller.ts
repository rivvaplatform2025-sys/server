// src/root.controller.ts
import { Controller, Get } from '@nestjs/common';
import { WelcomeService } from './shared/welcome/welcome.service';

@Controller()
export class RootController {
  constructor(private readonly welcomeService: WelcomeService) {}

  @Get()
  getRoot() {
    return this.welcomeService.getWelcomeMessage();
  }
}
