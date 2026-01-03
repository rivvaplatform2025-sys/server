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

    console.log('Creative Asset Query Service: ', organizationId);

    const qb = this.assetRepo
      .createQueryBuilder('assets')
      .leftJoinAndSelect('assets.campaign', 'campaign')
      .leftJoinAndSelect('assets.createdby', 'createdby')
      .where('assets.organizationId = :organizationId', {
        organizationId: organizationId,
      });

    // 🔎 Search
    if (filters.search) {
      qb.andWhere(
        '(assets.title ILIKE :search OR assets.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // 🎯 Status filter
    if (filters.status) {
      qb.andWhere('assets.status = :status', {
        status: filters.status,
      });
    }

    // 📊 Pagination
    qb.orderBy('assets.createdAt', 'DESC')
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
