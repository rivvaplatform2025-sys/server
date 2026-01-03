import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreativeAsset } from '../domain/entities/creative-assets.entity';
import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { In, Repository } from 'typeorm';
import { CreateCreativeAssetDto } from '../application/dto/create-creative-asset.dto';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { AssetTypeStatus } from '../domain/enums/asset-type-status.enum';
import { CreativeAssetMapper } from '../application/mapping/creative-asset.mapper';
import { CreativeAssetResponseDto } from '../application/dto/response-creative-asset.dto';
import { CreativeAssetStatus } from '../domain/enums/asset-status.enum';
import { UpdateCreativeAssetDto } from '../application/dto/update-creative-asset.dto';
import { CampaignAssignment } from 'src/modules/campaign/domain/entities/campaign-assignment.entity';
import { AssignmentStatus } from 'src/modules/campaign/domain/enums/assignment-status.enum';
import { CreativeAssetNotificationService } from 'src/modules/notification/services/creative-asset-notification.service';
import {
  IApproveRejectAssetNotification,
  ISubmitAssetNotification,
} from 'src/shared/dto/email-notification.dto';

@Injectable()
export class CreativeAssetCommandService {
  constructor(
    @InjectRepository(CreativeAsset)
    private readonly assetRepo: Repository<CreativeAsset>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(CampaignAssignment)
    private readonly assignmentRepo: Repository<CampaignAssignment>,
    private readonly assetNotificationService: CreativeAssetNotificationService,
  ) {}

  async create(
    createdById: string,
    organizationId: string,
    dto: CreateCreativeAssetDto,
  ): Promise<CreativeAssetResponseDto> {
    //get the creator profile through its Id
    // 1️ Validate organization
    const organization = await this.orgRepo.findOne({
      where: { id: organizationId },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    // 2️ Validate manager belongs to org
    const userProfile = await this.userRepo.findOne({
      where: {
        id: createdById,
        organization: { id: organizationId },
      },
      relations: { userRoles: true },
    });
    if (!userProfile)
      throw new NotFoundException('User does not belong to this organization');

    // 3. validate Campaign exist and is been done by the Organization
    const campaignProfile = await this.campaignRepo.findOne({
      where: {
        id: dto.campaignId,
        organization: { id: organizationId },
      },
    });
    if (!campaignProfile)
      throw new NotFoundException('Campaign not found for this organization');

    await this.ensureUserAssignedToCampaign(dto.campaignId, createdById);

    // 4. Create campaign
    const asset = this.assetRepo.create({
      title: dto.title,
      description: dto.description,
      fileUrl: dto.fileUrl,
      type: dto.fileType as AssetTypeStatus,
      status: CreativeAssetStatus.DRAFT,
      createdBy: userProfile,
      campaign: campaignProfile,
    });
    await this.assetRepo.save(asset);

    return CreativeAssetMapper.toResponse(asset);
  }

  async update(
    assetId: string,
    dto: UpdateCreativeAssetDto,
  ): Promise<CreativeAssetResponseDto> {
    const asset = await this.assetRepo.findOne({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');

    Object.assign(asset, dto);

    return CreativeAssetMapper.toResponse(await this.assetRepo.save(asset));
  }

  async delete(assetId: string): Promise<void> {
    const asset = await this.assetRepo.findOne({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');

    await this.assetRepo.remove(asset);
  }

  async submit(
    assetId: string,
    userId: string,
  ): Promise<CreativeAssetResponseDto> {
    const asset = await this.assetRepo.findOne({
      where: { id: assetId },
      relations: ['createdBy', 'campaign', 'campaign.organization'],
    });

    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.createdBy.id !== userId)
      throw new ForbiddenException('Not owner');

    if (asset.status !== CreativeAssetStatus.DRAFT)
      throw new BadRequestException('Asset already submitted');

    asset.status = CreativeAssetStatus.SUBMITTED;
    await this.assetRepo.save(asset);

    const profile: ISubmitAssetNotification = {
      organizationId: asset.campaign.organization.id,
      organizationName: asset.campaign.organization.name,
      campaignTitle: asset.campaign.title,
      assetTitle: asset.title,
      creatorName: `${asset.createdBy.firstName} ${asset.createdBy.lastName}`,
      reviewUrl: '',
    };

    await this.assetNotificationService.notifyAssetSubmitted(profile);

    return CreativeAssetMapper.toResponse(asset);
  }

  async approve(assetId: string): Promise<CreativeAssetResponseDto> {
    const asset = await this.assetRepo.findOne({
      where: { id: assetId },
      relations: ['createdBy', 'campaign', 'campaign.organization'],
    });
    if (!asset) throw new NotFoundException();

    if (asset.status !== CreativeAssetStatus.SUBMITTED)
      throw new BadRequestException('Asset not submitted');

    asset.status = CreativeAssetStatus.APPROVED;
    await this.assetRepo.save(asset);

    const profile: IApproveRejectAssetNotification = {
      status: CreativeAssetStatus.APPROVED,
      creatorName: `${asset.createdBy.firstName} ${asset.createdBy.lastName}`,
      creatorEmail: asset.createdBy.email,
      assetTitle: asset.title,
      campaignTitle: asset.campaign.title,
      organizationName: asset.campaign.organization.name,
      fileUrl: '',
    };

    await this.assetNotificationService.notifyAssetDecision(profile);

    return CreativeAssetMapper.toResponse(asset);
  }

  async reject(assetId: string): Promise<CreativeAssetResponseDto> {
    const asset = await this.assetRepo.findOne({
      where: { id: assetId },
      relations: ['createdBy', 'campaign', 'campaign.organization'],
    });
    if (!asset) throw new NotFoundException();

    if (asset.status !== CreativeAssetStatus.SUBMITTED)
      throw new BadRequestException('Asset not submitted');

    asset.status = CreativeAssetStatus.REJECTED;
    await this.assetRepo.save(asset);

    const profile: IApproveRejectAssetNotification = {
      status: CreativeAssetStatus.REJECTED,
      creatorName: `${asset.createdBy.firstName} ${asset.createdBy.lastName}`,
      creatorEmail: asset.createdBy.email,
      assetTitle: asset.title,
      campaignTitle: asset.campaign.title,
      organizationName: asset.campaign.organization.name,
      fileUrl: '',
    };

    await this.assetNotificationService.notifyAssetDecision(profile);

    return CreativeAssetMapper.toResponse(asset);
  }

  private async ensureUserAssignedToCampaign(
    campaignId: string,
    userId: string,
  ) {
    const assignment = await this.assignmentRepo.findOne({
      where: {
        campaign: { id: campaignId },
        user: { id: userId },
        status: In([AssignmentStatus.ACCEPTED, AssignmentStatus.IN_PROGRESS]),
      },
      select: { id: true },
    });
    if (!assignment) {
      throw new ForbiddenException('You are not assigned to this campaign');
    }
    return assignment;
  }
}
