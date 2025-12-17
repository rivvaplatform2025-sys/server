import { IsEnum } from 'class-validator';
import { CampaignStatus } from '../../domain/enums/campaign-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeCampaignStatusDto {
  @ApiProperty()
  @IsEnum(CampaignStatus, {
    message: `status must be one of: ${Object.values(CampaignStatus).join(', ')}`,
  })
  status: CampaignStatus;
}
