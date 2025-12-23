import { ApiProperty } from '@nestjs/swagger';

export class PlatformResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
