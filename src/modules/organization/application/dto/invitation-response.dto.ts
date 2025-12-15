import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '../../domain/enums/invitation-status.enum';

export class InvitationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  token: string;

  @ApiProperty()
  status: InvitationStatus;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  organization: InvitationOrganizationDto | null;

  @ApiProperty()
  invitedBy?: InvitationUserDto | null;
}

export class InvitationUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class InvitationOrganizationDto {
  @ApiProperty()
  companyName: string;

  @ApiProperty()
  email: string;
}
