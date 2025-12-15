import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class CreateInvitationRequestDto {
  @ApiProperty()
  @IsEmail()
  guestEmail: string;

  @ApiProperty()
  @IsUUID()
  organizationId: string;

  @ApiProperty()
  @IsUUID()
  guestRoleId: string;
}
