import { OrganizationInvitation } from '../../domain/entities/invitation.entity';
import { InvitationResponseDto } from '../dto/invitation-response.dto';

export class InvitationMapper {
  static toResponse(invitation: OrganizationInvitation): InvitationResponseDto {
    return {
      id: invitation.id,
      email: invitation.email,
      token: invitation.token,
      status: invitation.status,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      organization: invitation.organization
        ? {
            companyName: invitation.organization.name,
            email: invitation.organization.email,
          }
        : null,
      invitedBy: invitation.invitedBy
        ? {
            email: invitation.invitedBy.email,
            firstName: invitation.invitedBy.firstName,
            lastName: invitation.invitedBy.lastName,
          }
        : null,
    };
  }
}
