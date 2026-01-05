// src/modules/inbox/application/dto/send-message.dto.ts
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { MessageTypeEnum } from '../../domain/enum/message-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  size?: number;

  @ApiProperty({ required: false })
  mimeType?: string;
}

export class SendMessageDto {
  @ApiProperty()
  @IsUUID()
  conversationId: string;

  @ApiProperty({ enum: MessageTypeEnum })
  @IsEnum(MessageTypeEnum)
  type: MessageTypeEnum;

  @ApiProperty({ required: false })
  @IsOptional()
  content?: string;

  @ApiProperty({
    required: false,
    type: AttachmentDto,
    example: [{ url: '...', name: 'design.png' }],
  })
  @IsOptional()
  attachments?: AttachmentDto[];
}
