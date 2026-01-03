import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreativeAssetStatus } from '../../domain/enums/asset-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreativeAssetFilterDto {
  @ApiPropertyOptional({
    enum: CreativeAssetStatus,
    description: 'Filter by status -> [DRAFT, SUBMITTED, APPROVED, REJECTED]',
  })
  @IsOptional()
  @IsEnum(CreativeAssetStatus)
  status?: CreativeAssetStatus;

  @ApiPropertyOptional({
    description: 'Search by title or description',
    example: 'launch',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
