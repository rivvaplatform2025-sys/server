import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './domain/entities/campaign.entity';
import { CampaignAssignment } from './domain/entities/campaign-assignment.entity';
import { CampaignCommandService } from './services/campaign.command.service';
import { CampaignManagerController } from './controllers/campaign-manager.controller';
import { Organization } from '../organization/domain/entities/organization.entity';
import { User } from '../users/domain/entities/user.entity';
import { CampaignWorkflowService } from './services/campaign.workflow.service';
import { CampaignQueryService } from './services/campaign-query.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      CampaignAssignment,
      Organization,
      User,
    ]),
  ],
  providers: [
    CampaignCommandService,
    CampaignWorkflowService,
    CampaignQueryService,
  ],
  controllers: [CampaignManagerController],
  exports: [TypeOrmModule],
})
export class CampaignModule {}
