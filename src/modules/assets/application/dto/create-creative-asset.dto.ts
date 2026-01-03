import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCreativeAssetDto {
  @ApiProperty()
  @IsUUID()
  campaignId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiProperty()
  @IsString()
  fileType: string;
}
