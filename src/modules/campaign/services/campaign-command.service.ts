// src/modules/campaign/services/campaign-command.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from '../domain/entities/campaign.entity';
import { In, Repository } from 'typeorm';
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
import { Platform } from 'src/modules/platform/domain/entities/platform.entity';
import { CampaignAssignmentService } from './campaign-assignment.service';

@Injectable()
export class CampaignCommandService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Platform)
    private readonly platformRepo: Repository<Platform>,
    private readonly workflow: CampaignWorkflowService,
    private readonly assignmentSvc: CampaignAssignmentService,
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

    // const platforms = await this.platformRepo.findBy({
    //   id: In(dto.platformIds),
    // });
    const platforms = await this.platformRepo.findBy({
      id: In(dto.platformIds),
    });
    if (platforms.length !== dto.platformIds.length) {
      throw new BadRequestException('One or more platforms are invalid');
    }

    // 3️⃣ Create campaign
    const campaign = this.campaignRepo.create({
      title: dto.title,
      description: dto.description,
      startDate: new Date(dto.startDate!),
      endDate: new Date(dto.endDate!),
      status: CampaignStatus.DRAFT,
      budget: dto.budget,
      manager: userProfile,
      organization,
      platforms,
    });

    await this.campaignRepo.save(campaign);

    // Assign creators
    await this.assignmentSvc.assignUsers(
      campaign.id,
      dto.assignments?.creators,
      dto.assignments?.designers,
    );

    return CampaignMapper.toResponse(campaign);
  }

  async update(campaignId: string, dto: UpdateCampaignDto) {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
      relations: ['platforms'],
    });
    if (!campaign) throw new NotFoundException('Campaign not found.');

    if (dto.platformIds) {
      const platforms = await this.platformRepo.findBy({
        id: In(dto.platformIds),
      });

      if (platforms.length !== dto.platformIds.length) {
        throw new BadRequestException('One or more platforms are invalid');
      }

      campaign.platforms = platforms; // ✅ correct replacement
    }

    campaign.title = dto.title ?? campaign.title;
    campaign.description = dto.description ?? campaign.description;
    campaign.startDate = dto.startDate
      ? new Date(dto.startDate)
      : campaign.startDate;
    campaign.endDate = dto.endDate ? new Date(dto.endDate) : campaign.endDate;
    campaign.budget = dto.budget ?? campaign.budget;

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
