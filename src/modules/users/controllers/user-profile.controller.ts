import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserCommandService } from '../services/user-command.service';
import { UserQueryService } from '../services/user.query.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UpdateProfileRequestDto } from '../application/dto/update-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@ApiTags('UserProfile')
@ApiBearerAuth('access-token')
@Controller({ path: 'users/me', version: '1' })
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(
    private readonly commandService: UserCommandService,
    private readonly queryService: UserQueryService,
  ) {}

  @Get()
  getMe(@CurrentUser('id') userId: string) {
    return this.queryService.getMe(userId);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileRequestDto,
  ) {
    return this.commandService.updateProfile(userId, dto);
  }
}
