import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreativeAsset } from '../domain/entities/creative-assets.entity';
import { CreativeAssetStatsResponseDto } from './dto/campaign-asset-stats.response.dto';
import { CreativeAssetStatus } from '../domain/enums/asset-status.enum';

@Injectable()
export class AssetAnalyticsService {
  constructor(
    @InjectRepository(CreativeAsset)
    private readonly assetRepo: Repository<CreativeAsset>,
  ) {}

  async getCampaignAssetStats(
    organizationId: string,
  ): Promise<CreativeAssetStatsResponseDto> {
    const raw = await this.assetRepo
      .createQueryBuilder('asset')
      .innerJoin('asset.campaign', 'campaign')
      .innerJoin('campaign.organization', 'organization')
      .select([
        'COUNT(asset.id)::int AS "totalAssets"',
        `COUNT(CASE WHEN asset.status = :approved THEN 1 END)::int AS "approvedAssets"`,
        `COUNT(CASE WHEN asset.status = :submitted THEN 1 END)::int AS "pendingAssets"`,
        `COUNT(CASE WHEN asset.status = :inReview THEN 1 END)::int AS "inReviewAssets"`,
      ])
      .andWhere('organization.id = :organizationId', { organizationId })
      .setParameters({
        approved: CreativeAssetStatus.APPROVED,
        submitted: CreativeAssetStatus.SUBMITTED,
        inReview: CreativeAssetStatus.IN_REVIEW,
      })
      .getRawOne<CreativeAssetStatsResponseDto>();

    return {
      totalAssets: raw ? (raw.totalAssets ?? 0) : 0,
      approvedAssets: raw ? (raw.approvedAssets ?? 0) : 0,
      pendingAssets: raw ? (raw.pendingAssets ?? 0) : 0,
      inReviewAssets: raw ? (raw.inReviewAssets ?? 0) : 0,
    };
  }
}
