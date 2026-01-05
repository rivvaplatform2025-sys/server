// src/modules/assets/services/creative-assets-query.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreativeAsset } from '../domain/entities/creative-assets.entity';
import { Repository } from 'typeorm';
import { CreativeAssetFilterDto } from '../application/dto/filter-creative-asset.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { CreativeAssetResponseDto } from '../application/dto/response-creative-asset.dto';
import { CreativeAssetMapper } from '../application/mapping/creative-asset.mapper';

@Injectable()
export class CreativeAssetQueryService {
  constructor(
    @InjectRepository(CreativeAsset)
    private readonly assetRepo: Repository<CreativeAsset>,
  ) {}

  async findByOrganization(
    organizationId: string,
    filters: CreativeAssetFilterDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CreativeAssetResponseDto>> {
    const page = pagination.getPage();
    const limit = pagination.getLimit();

    const qb = this.assetRepo
      .createQueryBuilder('asset')
      .leftJoinAndSelect('asset.campaign', 'campaign')
      .leftJoinAndSelect('campaign.organization', 'organization')
      .leftJoinAndSelect('asset.createdBy', 'createdBy')
      .where('organization.id = :organizationId', {
        organizationId,
      });

    // 🔎 Search
    if (filters.search) {
      qb.andWhere(
        '(asset.title ILIKE :search OR asset.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // 🎯 Status filter
    if (filters.status) {
      qb.andWhere('asset.status = :status', {
        status: filters.status,
      });
    }

    // 📊 Pagination
    qb.orderBy('asset.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [assets, totalItems] = await qb.getManyAndCount();

    const items = assets.map((asset) => CreativeAssetMapper.toResponse(asset));

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      },
    };
  }
}
