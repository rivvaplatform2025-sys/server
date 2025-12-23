import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlatformQueryService } from '../services/platform-query.service';

@ApiTags('Platform')
@Controller({ path: 'platform/manager', version: '1' })
export class PlatformManagerController {
  constructor(private readonly queryService: PlatformQueryService) {}

  @Get()
  findAll() {
    return this.queryService.getAll();
  }

  @Get('get/:id')
  findById(@Param('id') id: string) {
    return this.queryService.getById(id);
  }
}
