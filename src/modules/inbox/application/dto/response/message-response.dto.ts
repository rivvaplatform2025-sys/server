import { ApiProperty } from '@nestjs/swagger';
import { AttachmentDto } from '../send-message.dto';

// src/modules/inbox/application/dto/response/message-response.dto.ts
export class MessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conversationId: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  content?: string;

  @ApiProperty({ type: AttachmentDto })
  attachments?: AttachmentDto[];

  @ApiProperty()
  isEdited: boolean;

  @ApiProperty()
  createdAt: Date;
}
