import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationInvitation } from '../domain/entities/invitation.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { Organization } from '../domain/entities/organization.entity';
import { CreateInvitationRequestDto } from '../application/dto/create-invitation.dto';
import { InvitationStatus } from '../domain/enums/invitation-status.enum';
import { randomUUID } from 'crypto';
import { InvitationResponseDto } from '../application/dto/invitation-response.dto';
import { InvitationMapper } from '../application/mapping/invitation.mapper';
import { AcceptInvitationDto } from '../application/dto/accept-invitation.dto';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(OrganizationInvitation)
    private readonly invitationRepo: Repository<OrganizationInvitation>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
  ) {}

  async createInvitation(
    invitedByUserId: string,
    dto: CreateInvitationRequestDto,
  ): Promise<InvitationResponseDto> {
    const organization = await this.orgRepo.findOne({
      where: { id: dto.organizationId },
    });
    if (!organization) throw new NotFoundException('Organization not found');

    const existingInvite = await this.invitationRepo.findOne({
      where: {
        email: dto.guestEmail,
        organization: { id: dto.organizationId },
        status: InvitationStatus.PENDING,
      },
    });
    if (existingInvite) {
      throw new BadRequestException('User already invited');
    }

    const invitation = this.invitationRepo.create({
      email: dto.guestEmail,
      token: randomUUID(),
      status: InvitationStatus.PENDING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 72), // 72 hours ~ 3days
      organization,
      invitedBy: { id: invitedByUserId } as User,
    });

    await this.invitationRepo.save(invitation);

    // TODO: send email
    // emailService.sendInvite(invitation.email, invitation.token)

    return InvitationMapper.toResponse(invitation);
  }

  async acceptInvitation(dto: AcceptInvitationDto, invitedByUserId: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { token: dto.token },
      relations: ['organization'],
    });
    if (!invitation) throw new NotFoundException('Invalid invitation');

    if (invitation.expiresAt < new Date()) {
      invitation.status = InvitationStatus.EXPIRED;
      await this.invitationRepo.save(invitation);
      throw new BadRequestException('Invitation expired');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Invitation already used');
    }

    const user = await this.userRepo.findOne({
      where: { id: invitedByUserId },
      relations: ['organization'],
    });
    if (!user) throw new NotFoundException('User not found');

    user.organization = invitation.organization;
    await this.userRepo.save(user);

    invitation.status = InvitationStatus.ACCEPTED;
    await this.invitationRepo.save(invitation);

    return invitation.organization;
  }
}
