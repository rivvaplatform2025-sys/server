import { ApiProperty } from '@nestjs/swagger';

export class CreativeAssetStatsResponseDto {
  @ApiProperty()
  totalAssets: number;

  @ApiProperty()
  approvedAssets: number;

  @ApiProperty()
  pendingAssets: number;

  @ApiProperty()
  inReviewAssets: number;
}
