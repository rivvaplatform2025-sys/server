import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { UserRole } from './domain/entities/user-role';
import { UserCommandService } from './services/user-command.service';
import { UserQueryService } from './services/user.query.service';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserAdminController } from './controllers/user-admin.controller';
import { UserOnboardingController } from './controllers/user-onboarding.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRole])],
  providers: [UserCommandService, UserQueryService],
  controllers: [
    UserProfileController,
    UserAdminController,
    UserOnboardingController,
  ],
  exports: [TypeOrmModule],
})
export class UsersModule {}
