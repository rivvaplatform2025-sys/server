import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InvitationService } from '../services/invitation.service';
import { CreateInvitationRequestDto } from '../application/dto/create-invitation.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { InvitationResponseDto } from '../application/dto/invitation-response.dto';
import { AcceptInvitationDto } from '../application/dto/accept-invitation.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Organization')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller({ path: 'organization/invitation', version: '1' })
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Post('create')
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateInvitationRequestDto,
  ): Promise<InvitationResponseDto> {
    return this.invitationService.createInvitation(userId, dto);
  }

  @Post('accept')
  accept(@CurrentUser('id') userId: string, @Body() dto: AcceptInvitationDto) {
    return this.invitationService.acceptInvitation(dto, userId);
  }
}
