import { BadRequestException, Injectable } from '@nestjs/common';
import { CampaignStatus } from '../domain/enums/campaign-status.enum';

@Injectable()
export class CampaignWorkflowService {
  private readonly transitions: Record<CampaignStatus, CampaignStatus[]> = {
    [CampaignStatus.DRAFT]: [CampaignStatus.IN_REVIEW],
    [CampaignStatus.IN_REVIEW]: [CampaignStatus.APPROVED],
    [CampaignStatus.APPROVED]: [CampaignStatus.RUNNING],
    [CampaignStatus.RUNNING]: [CampaignStatus.COMPLETED],
    [CampaignStatus.COMPLETED]: [CampaignStatus.ARCHIVED],
    [CampaignStatus.ARCHIVED]: [], // terminal state
  };

  canTransition(from: CampaignStatus, to: CampaignStatus): boolean {
    if (!this.transitions[from].includes(to)) {
      throw new BadRequestException(`Invalid transition from ${from} to ${to}`);
    }
    return this.transitions[from].includes(to);
  }
}
