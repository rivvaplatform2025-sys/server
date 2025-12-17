import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import databaseConfig from './config/database/database.config';
import { createTypeOrmConfig } from './config/database';
import { Role } from './modules/role/domain/entities/role.entity';
import { RolePermission } from './modules/role/domain/entities/role-permission.entity';
import { User } from './modules/users/domain/entities/user.entity';
import { VerificationToken } from './modules/verification/domain/entities/verification-token.entity';
import { RefreshToken } from './modules/auth/domain/entities/refresh-token.entity';
import { Organization } from './modules/organization/domain/entities/organization.entity';
import { Permission } from './modules/permissions/domain/entities/permission.entity';
import { UserRole } from './modules/users/domain/entities/user-role';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RootController } from './root.controller';
import { WelcomeService } from './shared/welcome/welcome.service';
import { NewsletterSubscriber } from './modules/newsletter/domain/entities/newsletter-subscriber.entity';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { Platform } from './modules/platform/domain/entities/platform.entity';
import { CategoryType } from './modules/category/domain/entities/category-type.entity';
import { Campaign } from './modules/campaign/domain/entities/campaign.entity';
import { CampaignAssignment } from './modules/campaign/domain/entities/campaign-assignment.entity';
import { CreativeAsset } from './modules/assets/domain/entities/creative-assets.entity';
import { CampaignComment } from './modules/campaign/domain/entities/campaign-comment.entity';
import { OrganizationInvitation } from './modules/organization/domain/entities/invitation.entity';
import { NotificationType } from './modules/notification/domain/entities/notification-type.entity';
import { NotificationTemplate } from './modules/notification/domain/entities/notification-template.entity';
import { CampaignModule } from './modules/campaign/campaign.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const baseConfig = createTypeOrmConfig(config);

        return {
          ...baseConfig,
          synchronize: false,
          autoLoadEntities: false,

          entities: [
            User,
            VerificationToken,
            RefreshToken,
            Organization,
            Role,
            Permission,
            RolePermission,
            UserRole,
            NewsletterSubscriber,
            Platform,
            CategoryType,
            Campaign,
            CampaignAssignment,
            CreativeAsset,
            CampaignComment,
            OrganizationInvitation,
            NotificationType,
            NotificationTemplate,
          ],

          extra: {
            max: 5,
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),
    AuthModule,
    NewsletterModule,
    CampaignModule,
  ],
  providers: [AppService, WelcomeService],
  controllers: [RootController, AppController],
  // exports: [AuthService],
})
export class AppModule {}
