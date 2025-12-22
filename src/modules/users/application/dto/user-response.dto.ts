import { ApiProperty } from '@nestjs/swagger';
import { RoleResponseDto } from 'src/modules/role/application/dto/role-response.dto';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  organization: UserOrganizationDto | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone?: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  avatarUrl?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  lastLoginAt: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  userRoles: UserProfileRoleDTO[];
}

export class UserOrganizationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;
}

export class UserProfileRoleDTO {
  @ApiProperty()
  role: RoleResponseDto;
}
