import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { CampaignCommandService } from '../services/campaign-command.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { User } from 'src/modules/users/domain/entities/user.entity';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
} from '../application/dto/campaign-command.dto';
import { CurrentOrganization } from 'src/modules/auth/decorators/current-organization.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ChangeCampaignStatusDto } from '../application/dto/change-campaign-status.dto';
import { CampaignFilterDto } from '../application/dto/campaign-filter.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { CampaignQueryService } from '../services/campaign-query.service';

@ApiTags('Campaign')
@Controller({ path: 'campaigns/manager', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Brand Manager')
export class CampaignManagerController {
  constructor(
    private readonly commandService: CampaignCommandService,
    private readonly queryService: CampaignQueryService,
  ) {}

  @Get()
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() filters: CampaignFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    return this.queryService.findByOrganization(
      organizationId,
      filters,
      pagination,
    );
  }

  @Post()
  create(
    @CurrentUser() user: User,
    @CurrentOrganization() organizationId: string,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.commandService.create(user.id, organizationId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.commandService.update(id, dto);
  }

  @Post(':id/change-status')
  changeStatus(
    @Param('id') campaignId: string,
    @CurrentOrganization() organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: ChangeCampaignStatusDto,
  ) {
    return this.commandService.changeStatus(
      campaignId,
      organizationId,
      userId,
      dto.status,
    );
  }
}
