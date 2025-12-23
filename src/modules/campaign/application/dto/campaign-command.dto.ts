import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CampaignBudget {
  @ApiProperty({ example: 5000 })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency: string;
}

export class CreateCampaignDto {
  @ApiProperty({ example: 'Influencer Launch Campaign' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Campaign description...' })
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-02-01' })
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2025-03-01' })
  @IsDateString()
  endDate?: string;

  @ApiProperty({ type: CampaignBudget })
  @ValidateNested()
  @Type(() => CampaignBudget)
  budget?: CampaignBudget;

  @ApiProperty({
    type: [String],
    description: 'Array of platform IDs',
    example: ['uuid-1', 'uuid-2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  platformIds: string[];
}

export class UpdateCampaignDto {
  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @ValidateNested()
  @Type(() => CampaignBudget)
  budget?: CampaignBudget;

  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('4', { each: true })
  platformIds: string[];
}
