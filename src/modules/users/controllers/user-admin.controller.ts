import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserQueryService } from '../services/user.query.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('UserProfile')
@Controller({ path: 'users/org', version: '1' })
export class UserAdminController {
  constructor(private readonly queryService: UserQueryService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':orgId')
  getOrganizationUsers(@Param('orgId') orgId: string) {
    return this.queryService.getOrganizationUsers(orgId);
  }
}
