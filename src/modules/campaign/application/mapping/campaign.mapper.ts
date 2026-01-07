import { Campaign } from '../../domain/entities/campaign.entity';
import { CampaignResponseDto } from '../dto/campaign-response.dto';

export class CampaignMapper {
  static toResponse(campaign: Campaign): CampaignResponseDto {
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      budget: {
        amount: campaign.budget.amount,
        currency: campaign.budget.currency,
      },
      platforms: campaign.platforms.map((p) => ({
        platform: {
          id: p.id,
          name: p.name,
        },
      })),
      createdAt: campaign.createdAt,
      manager: campaign.manager && {
        id: campaign.manager.id,
        email: campaign.manager.email,
        firstName: campaign.manager.firstName,
        lastName: campaign.manager.lastName,
        phone: campaign.manager.phone,
        avatarUrl: campaign.manager.avatarUrl,
      },
      organization: campaign.organization && {
        companyName: campaign.organization.name,
        email: campaign.organization.email,
      },
      assignments: campaign.assignments?.map((a) => ({
        id: a.id,
        role: a.role,
        status: a.status,
        createdAt: a.createdAt,
        user: {
          id: a.user.id,
          email: a.user.email,
          firstName: a.user.firstName,
          lastName: a.user.lastName,
          avatarUrl: a.user.avatarUrl,
        },
      })),
    };
  }
}
