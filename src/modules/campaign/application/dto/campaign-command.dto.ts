import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsObject, IsString } from 'class-validator';

export class CampaignBudget {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  currency: string;
}

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsDate()
  startDate?: Date;

  @ApiProperty()
  @IsDate()
  endDate?: Date;

  @ApiProperty({ type: CampaignBudget })
  @IsObject()
  budget?: CampaignBudget;
}

export class UpdateCampaignDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  startDate?: Date;

  @ApiProperty()
  endDate?: Date;

  @ApiProperty()
  budget?: CampaignBudget;
}
