import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreativeAsset } from './domain/entities/creative-assets.entity';
import { Campaign } from '../campaign/domain/entities/campaign.entity';
import { User } from '../users/domain/entities/user.entity';
import { CreativeAssetController } from './controllers/creative-asset.controller';
import { CreativeAssetCommandService } from './services/creative-asset-command.service';
import { CreativeAssetQueryService } from './services/creative-asset-query.service';
import { NotificationTemplate } from '../notification/domain/entities/notification-template.entity';
import { MailerModule } from 'src/shared/mailer/mailer.module';
import { CreativeAssetNotificationService } from '../notification/services/creative-asset-notification.service';
import { Organization } from '../organization/domain/entities/organization.entity';
import { CampaignAssignment } from '../campaign/domain/entities/campaign-assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CreativeAsset,
      Campaign,
      User,
      Organization,
      CampaignAssignment,
      NotificationTemplate,
    ]),
    MailerModule,
  ],
  controllers: [CreativeAssetController],
  providers: [
    CreativeAssetCommandService,
    CreativeAssetQueryService,
    CreativeAssetNotificationService,
  ],
  exports: [TypeOrmModule],
})
export class AssetModule {}
