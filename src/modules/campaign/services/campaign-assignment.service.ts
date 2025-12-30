import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignAssignment } from '../domain/entities/campaign-assignment.entity';
import { In, Repository } from 'typeorm';
import { Campaign } from '../domain/entities/campaign.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { AssignmentStatus } from '../domain/enums/assignment-status.enum';
import { CampaignRole } from '../domain/enums/campaign-role.enum';
import { AssignmentNotificationService } from 'src/modules/notification/services/assignment-notification.service';

@Injectable()
export class CampaignAssignmentService {
  constructor(
    @InjectRepository(CampaignAssignment)
    private readonly assignmentRepo: Repository<CampaignAssignment>,
    @InjectRepository(Campaign)
    private readonly campaignRepo: Repository<Campaign>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly notificationService: AssignmentNotificationService,
  ) {}

  async assignUsers(
    campaignId: string,
    creators: string[] = [],
    designers: string[] = [],
  ) {
    const campaign = await this.campaignRepo.findOne({
      where: { id: campaignId },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');

    const assignments: CampaignAssignment[] = [];

    for (const userId of creators) {
      assignments.push(
        this.assignmentRepo.create({
          campaign: { id: campaignId } as Campaign,
          user: { id: userId } as User,
          role: CampaignRole.CREATOR,
          status: AssignmentStatus.PENDING,
        }),
      );
    }

    for (const userId of designers) {
      assignments.push(
        this.assignmentRepo.create({
          campaign: { id: campaignId } as Campaign,
          user: { id: userId } as User,
          role: CampaignRole.DESIGNER,
          status: AssignmentStatus.PENDING,
        }),
      );
    }

    await this.assignmentRepo.save(assignments);

    // 🔔 Notify
    await this.notificationService.notifyAssignment(assignments);
  }

  async respondToAssignment(
    assignmentId: string,
    userId: string,
    status: AssignmentStatus.ACCEPTED | AssignmentStatus.REJECTED,
  ) {
    const assignment = await this.assignmentRepo.findOne({
      where: {
        id: assignmentId,
        user: { id: userId },
      },
    });

    if (!assignment) throw new ForbiddenException('Assignment not found');
    if (assignment.status !== AssignmentStatus.PENDING)
      throw new ForbiddenException('Assignment already responded to');

    assignment.status = status as AssignmentStatus;
    return this.assignmentRepo.save(assignment);
  }

  async getCreatorsOnCampaign(campaignId: string) {
    return this.assignmentRepo.find({
      where: {
        campaign: { id: campaignId },
        role: CampaignRole.CREATOR,
        status: AssignmentStatus.ACCEPTED,
      },
      relations: ['user'],
    });
  }

  async getCampaignsAssignedToUser(userId: string) {
    return this.assignmentRepo.find({
      where: {
        user: { id: userId },
        status: In([
          AssignmentStatus.ACCEPTED,
          AssignmentStatus.IN_PROGRESS,
          AssignmentStatus.SUBMITTED,
        ]),
      },
      relations: ['campaign'],
    });
  }
}
