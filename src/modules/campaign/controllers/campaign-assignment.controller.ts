// src/modules/campaign/controllers/campaign-assignment.controller.ts

import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CampaignAssignmentService } from '../services/campaign-assignment.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { RespondAssignmentDto } from '../application/dto/respond-assignment.dto';

@ApiTags('Campaign Assignments')
@Controller({ path: 'campaign-assignments', version: '1' })
@UseGuards(JwtAuthGuard)
export class CampaignAssignmentController {
  constructor(private readonly assignmentService: CampaignAssignmentService) {}

  @Get('me/campaigns')
  getMyCampaigns(@CurrentUser('id') userId: string) {
    return this.assignmentService.getCampaignsAssignedToUser(userId);
  }

  @Get('campaign/:campaignId/creators')
  getCreators(@Param('campaignId') campaignId: string) {
    return this.assignmentService.getCreatorsOnCampaign(campaignId);
  }

  @Patch(':id/respond')
  respond(
    @Param('id') assignmentId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: RespondAssignmentDto,
  ) {
    return this.assignmentService.respondToAssignment(
      assignmentId,
      userId,
      dto.status,
    );
  }
}
