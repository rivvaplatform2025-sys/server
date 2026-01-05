// src/modules/inbox/application/dto/get-inbox.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class GetInboxDto extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  campaignId?: string;
}
