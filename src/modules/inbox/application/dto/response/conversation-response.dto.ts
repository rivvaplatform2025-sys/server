// src/modules/inbox/application/dto/response/conversation-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class LastMessageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content?: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  createdAt?: Date;
}

export class ConversationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title?: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  campaignId?: string;

  @ApiProperty({ type: LastMessageDto })
  lastMessage?: LastMessageDto;

  @ApiProperty()
  unreadCount: number;

  @ApiProperty()
  createdAt: Date;
}
