import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OnboardingRole {
  BRAND_MANAGER = 'brand manager',
  CREATOR = 'creator',
  DESIGNER = 'designer',
}

export class SelectRoleDto {
  @ApiProperty()
  @IsEnum(OnboardingRole)
  role: OnboardingRole;
}
