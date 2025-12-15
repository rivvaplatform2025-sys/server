import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './domain/entities/organization.entity';
import { OrganizationInvitation } from './domain/entities/invitation.entity';
import { InvitationService } from './services/invitation.service';
import { InvitationController } from './controllers/invitation.controller';
import { User } from '../users/domain/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Organization, OrganizationInvitation, User]),
  ],
  providers: [InvitationService],
  controllers: [InvitationController],
  exports: [TypeOrmModule],
})
export class OrganizationsModule {}
