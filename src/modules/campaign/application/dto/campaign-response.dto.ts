import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '../../domain/enums/campaign-status.enum';
import { CampaignBudget } from './campaign-command.dto';
import { InvitationOrganizationDto } from 'src/modules/organization/application/dto/invitation-response.dto';

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

export class CampaignOrganizationDto extends InvitationOrganizationDto {}

export class CampaignResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: CampaignStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  budget: CampaignBudget;

  @ApiProperty()
  createdAt: Date;

  manager?: CampaignManagerDto;

  organization?: CampaignOrganizationDto;
}
