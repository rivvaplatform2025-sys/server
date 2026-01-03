import { CreativeAsset } from '../../domain/entities/creative-assets.entity';
import { CreativeAssetResponseDto } from '../dto/response-creative-asset.dto';

export class CreativeAssetMapper {
  static toResponse(asset: CreativeAsset): CreativeAssetResponseDto {
    return {
      id: asset.id,
      title: asset.title,
      description: asset.description,
      fileUrl: asset.fileUrl,
      type: asset.type,
      status: asset.status,
      createdAt: asset.createdAt,
      createdBy: asset.createdBy && {
        email: asset.createdBy.email,
        firstName: asset.createdBy.firstName,
        lastName: asset.createdBy.lastName,
        phone: asset.createdBy.phone,
        role: asset.createdBy.userRoles[0].role.name,
      },
      campaign: asset.campaign && {
        campaignTitle: asset.campaign.title,
        description: asset.campaign.description,
        status: asset.campaign.status,
        startDate: asset.campaign.startDate,
        endDate: asset.campaign.endDate,
        manager: asset.campaign.manager && {
          id: asset.campaign.manager.id,
          email: asset.campaign.manager.email,
          firstName: asset.campaign.manager.firstName,
          lastName: asset.campaign.manager.lastName,
          phone: asset.campaign.manager.phone,
          avatarUrl: asset.campaign.manager.avatarUrl,
        },
      },
    };
  }
}
