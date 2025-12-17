import { IsOptional, IsEnum, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignStatus } from '../../domain/enums/campaign-status.enum';

export class CampaignFilterDto {
  @ApiPropertyOptional({
    enum: CampaignStatus,
    description: 'Filter by campaign status',
  })
  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;

  @ApiPropertyOptional({
    description: 'Search by title or description',
    example: 'launch',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by manager ID',
  })
  @IsOptional()
  @IsUUID()
  managerId?: string;
}
