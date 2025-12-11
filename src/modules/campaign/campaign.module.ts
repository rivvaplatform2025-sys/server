import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './domain/entities/campaign.entity';
import { CampaignAssignment } from './domain/entities/campaign-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, CampaignAssignment])],
  exports: [TypeOrmModule],
})
export class CampaignModule {}
