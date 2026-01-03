import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreativeAssetCommandService } from '../services/creative-asset-command.service';
import { CreativeAssetQueryService } from '../services/creative-asset-query.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { CreateCreativeAssetDto } from '../application/dto/create-creative-asset.dto';
import { CurrentOrganization } from 'src/modules/auth/decorators/current-organization.decorator';
import { CreativeAssetFilterDto } from '../application/dto/filter-creative-asset.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { UpdateCreativeAssetDto } from '../application/dto/update-creative-asset.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@ApiTags('Creative Assets')
@Controller({ path: 'creative-assets', version: '1' })
@UseGuards(JwtAuthGuard)
export class CreativeAssetController {
  constructor(
    private readonly commandService: CreativeAssetCommandService,
    private readonly queryService: CreativeAssetQueryService,
  ) {}

  @Get()
  findAll(
    @CurrentOrganization() organizationId: string,
    @Query() filters: CreativeAssetFilterDto,
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
    @CurrentOrganization() organizationId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCreativeAssetDto,
  ) {
    return this.commandService.create(userId, organizationId, dto);
  }

  @Patch(':id')
  update(@Param('id') assetId: string, @Body() dto: UpdateCreativeAssetDto) {
    return this.commandService.update(assetId, dto);
  }

  @Delete(':id')
  remove(@Param('id') assetId: string) {
    return this.commandService.delete(assetId);
  }

  @Post(':id/approve')
  @Roles('Admin', 'Business Manager')
  @UseGuards(RolesGuard)
  approve(@Param('id') assetId: string) {
    return this.commandService.approve(assetId);
  }

  @Post(':id/reject')
  @Roles('Admin', 'Business Manager')
  @UseGuards(RolesGuard)
  reject(@Param('id') assetId: string) {
    return this.commandService.reject(assetId);
  }
}
