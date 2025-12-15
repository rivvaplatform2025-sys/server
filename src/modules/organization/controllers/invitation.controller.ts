import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { InvitationService } from '../services/invitation.service';
import { CreateInvitationRequestDto } from '../application/dto/create-invitation.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { InvitationResponseDto } from '../application/dto/invitation-response.dto';
import { AcceptInvitationDto } from '../application/dto/accept-invitation.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Organization')
@Controller({ path: 'organization/invitation', version: '1' })
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateInvitationRequestDto,
  ): Promise<InvitationResponseDto> {
    return this.invitationService.createInvitation(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept')
  accept(@CurrentUser('id') userId: string, @Body() dto: AcceptInvitationDto) {
    return this.invitationService.acceptInvitation(dto, userId);
  }
}
