import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campaign } from '../domain/entities/campaign.entity';
import { CampaignResponseDto } from '../application/dto/campaign-response.dto';
import { CampaignFilterDto } from '../application/dto/campaign-filter.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { CampaignMapper } from '../application/mapping/campaign.mapper';

@Injectable()
export class CampaignQueryService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
  ) {}

  async findByOrganization(
    organizationId: string,
    filters: CampaignFilterDto,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<CampaignResponseDto>> {
    const page = pagination.getPage();
    const limit = pagination.getLimit();

    const qb = this.campaignRepo
      .createQueryBuilder('campaign')
      .leftJoinAndSelect('campaign.manager', 'manager')
      .where('campaign.organizationId = :orgId', {
        orgId: organizationId,
      });

    // 🔎 Search
    if (filters.search) {
      qb.andWhere(
        '(campaign.title ILIKE :search OR campaign.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    // 🎯 Status filter
    if (filters.status) {
      qb.andWhere('campaign.status = :status', {
        status: filters.status,
      });
    }

    // 👤 Manager filter
    if (filters.managerId) {
      qb.andWhere('manager.id = :managerId', {
        managerId: filters.managerId,
      });
    }

    // 📊 Pagination
    qb.skip((page - 1) * limit)
      .take(limit)
      .orderBy('campaign.createdAt', 'DESC');

    const [campaigns, totalItems] = await qb.getManyAndCount();

    const items = campaigns.map((campaign) =>
      CampaignMapper.toResponse(campaign),
    );

    //return users.map((user) => UserMapper.toResponse(user));

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
