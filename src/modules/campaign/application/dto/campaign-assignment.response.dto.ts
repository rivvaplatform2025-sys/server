import { ApiProperty } from '@nestjs/swagger';
import { CampaignRole } from '../../domain/enums/campaign-role.enum';
import { AssignmentStatus } from '../../domain/enums/assignment-status.enum';

export class AssignedUserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  avatarUrl?: string;
}

export class CampaignAssignmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: CampaignRole })
  role: CampaignRole;

  @ApiProperty({ enum: AssignmentStatus })
  status: AssignmentStatus;

  @ApiProperty({ type: AssignedUserDto })
  user: AssignedUserDto;

  @ApiProperty()
  createdAt: Date;
}
