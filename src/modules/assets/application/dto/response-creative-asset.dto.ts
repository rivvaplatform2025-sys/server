import { ApiProperty } from '@nestjs/swagger';
import { AssetTypeStatus } from '../../domain/enums/asset-type-status.enum';
import { CampaignStatus } from 'src/modules/campaign/domain/enums/campaign-status.enum';
import { CampaignManagerDto } from 'src/modules/campaign/application/dto/campaign-response.dto';
import { CreativeAssetStatus } from '../../domain/enums/asset-status.enum';

export class CampaignAssetDto {
  @ApiProperty()
  campaignTitle: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: CampaignStatus })
  status: CampaignStatus;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ type: CampaignManagerDto, required: false })
  manager?: CampaignManagerDto;
}

export class UserCreatorDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  role: string;
}

export class CreativeAssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  fileUrl: string;

  @ApiProperty({ enum: AssetTypeStatus })
  type: AssetTypeStatus;

  @ApiProperty()
  status: CreativeAssetStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  createdBy: UserCreatorDto;

  @ApiProperty()
  campaign: CampaignAssetDto;
}
