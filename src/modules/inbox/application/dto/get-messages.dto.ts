// src/modules/inbox/application/dto/get-messages.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class GetMessagesDto extends PaginationDto {
  @ApiProperty()
  @IsUUID()
  conversationId: string;
}
