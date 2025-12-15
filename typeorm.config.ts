import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { Role } from 'src/modules/role/domain/entities/role.entity';
import { RolePermission } from 'src/modules/role/domain/entities/role-permission.entity';
import { Permission } from 'src/modules/permissions/domain/entities/permission.entity';
import { VerificationToken } from 'src/modules/verification/domain/entities/verification-token.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserRole } from 'src/modules/users/domain/entities/user-role';
import { NotificationType } from 'src/modules/notification/domain/entities/notification-type.entity';
import { NotificationTemplate } from 'src/modules/notification/domain/entities/notification-template.entity';
import { RefreshToken } from 'src/modules/auth/domain/entities/refresh-token.entity';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { NewsletterSubscriber } from 'src/modules/newsletter/domain/entities/newsletter-subscriber.entity';
import { Platform } from 'src/modules/platform/domain/entities/platform.entity';
import { CategoryType } from 'src/modules/category/domain/entities/category-type.entity';
import { Campaign } from 'src/modules/campaign/domain/entities/campaign.entity';
import { CampaignAssignment } from 'src/modules/campaign/domain/entities/campaign-assignment.entity';
import { CreativeAsset } from 'src/modules/assets/domain/entities/creative-assets.entity';
import { CampaignComment } from 'src/modules/campaign/domain/entities/campaign-comment.entity';
import { OrganizationInvitation } from 'src/modules/organization/domain/entities/invitation.entity';

config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: true,
  entities: [
    Role,
    Permission,
    RolePermission,
    Organization,
    User,
    VerificationToken,
    UserRole,
    NotificationType,
    NotificationTemplate,
    RefreshToken,
    NewsletterSubscriber,
    Platform,
    CategoryType,
    Campaign,
    CampaignAssignment,
    CreativeAsset,
    CampaignComment,
    OrganizationInvitation,
  ],
  migrations: ['src/database/migrations/*.ts'],
});

export default dataSource;
