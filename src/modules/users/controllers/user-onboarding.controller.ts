import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { SelectRoleDto } from '../application/dto/select-role.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('UserProfile')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'users/me/onboarding', version: '1' })
export class UserOnboardingController {
  @Post('select-role')
  selectRole(@CurrentUser('id') userId: string, @Body() dto: SelectRoleDto) {
    return {
      userId,
      selectedRole: dto.role,
    };
  }
}
