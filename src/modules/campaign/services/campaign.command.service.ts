import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from '../domain/entities/campaign.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
} from '../application/dto/campaign-command.dto';
import { CampaignStatus } from '../domain/enums/campaign-status.enum';
import { CampaignResponseDto } from '../application/dto/campaign-response.dto';
import { CampaignMapper } from '../application/mapping/campaign.mapper';
import { CampaignWorkflowService } from './campaign.workflow.service';

@Injectable()
export class CampaignCommandService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly workflow: CampaignWorkflowService,
  ) {}

  async create(
    userId: string,
    organizationId: string,
    dto: CreateCampaignDto,
  ): Promise<CampaignResponseDto> {
    // 1️⃣ Validate organization
    const organization = await this.orgRepo.findOne({
      where: { id: organizationId },
    });
    if (!organization) throw new ForbiddenException('Organization not found');

    // 2️⃣ Validate manager belongs to org
    const userProfile = await this.userRepo.findOne({
      where: {
        id: userId,
        organization: { id: organizationId },
      },
    });
    if (!userProfile)
      throw new ForbiddenException('User does not belong to this organization');

    // 3️⃣ Create campaign
    const campaign = this.campaignRepo.create({
      title: dto.title,
      description: dto.description,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: CampaignStatus.DRAFT,
      budget: dto.budget,
      manager: userProfile,
      organization,
    });

    await this.campaignRepo.save(campaign);

    return CampaignMapper.toResponse(campaign);
  }

  async update(campaignId: string, dto: UpdateCampaignDto) {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found.');

    Object.assign(campaign, dto);

    const savedCampaign = await this.campaignRepo.save(campaign);

    return CampaignMapper.toResponse(savedCampaign);
  }

  async changeStatus(
    campaignId: string,
    organizationId: string,
    actorId: string,
    nextStatus: CampaignStatus,
  ) {
    // 1️⃣ Load campaign with tenant isolation
    const campaign = await this.campaignRepo.findOne({
      where: {
        id: campaignId,
        organization: { id: organizationId },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        startDate: true,
        endDate: true,
        budget: true,
        createdAt: true,
      },
      relations: ['Organization', 'User'],
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const currentStatus = campaign.status;

    // 2️⃣ Idempotency check
    if (currentStatus === nextStatus) {
      return campaign;
    }

    // 3️⃣ Workflow validation (CORE INTEGRATION)
    this.workflow.canTransition(currentStatus, nextStatus);

    // 4️⃣ Apply transition
    campaign.status = nextStatus;

    // 5️⃣ Persist
    const savedCampaign = await this.campaignRepo.save(campaign);

    // 6️⃣ (Optional but recommended) Emit domain event / audit log
    // await this.auditService.logCampaignStatusChange({
    //   campaignId,
    //   from: currentStatus,
    //   to: nextStatus,
    //   actorId,
    // });

    return CampaignMapper.toResponse(savedCampaign);
  }
}
