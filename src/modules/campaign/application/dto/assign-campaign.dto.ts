import { ApiProperty } from '@nestjs/swagger';

export class AssignUsersDto {
  @ApiProperty()
  userIds: string[];
}
