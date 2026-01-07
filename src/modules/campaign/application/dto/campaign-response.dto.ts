// src/modules/campaign/application/dto/campaign-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '../../domain/enums/campaign-status.enum';
import { CampaignBudget } from './campaign-command.dto';
import { InvitationOrganizationDto } from 'src/modules/organization/application/dto/invitation-response.dto';
import { PlatformResponseDto } from 'src/modules/platform/application/dto/platform-response.dto';
import { CampaignAssignmentResponseDto } from './campaign-assignment.response.dto';

export class CampaignManagerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  avatarUrl?: string;
}

export class CampaignPlatformDto {
  @ApiProperty()
  platform: PlatformResponseDto;
}

export class CampaignOrganizationDto extends InvitationOrganizationDto {}

export class CampaignResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: CampaignStatus })
  status: CampaignStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ type: CampaignBudget })
  budget: CampaignBudget;

  @ApiProperty({ type: [CampaignPlatformDto] })
  platforms: CampaignPlatformDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: CampaignManagerDto, required: false })
  manager?: CampaignManagerDto;

  @ApiProperty({ type: CampaignOrganizationDto, required: false })
  organization?: CampaignOrganizationDto;

  @ApiProperty({
    type: [CampaignAssignmentResponseDto],
    required: false,
  })
  assignments?: CampaignAssignmentResponseDto[];
}
