import { Message } from '../../domain/entities/message.entity';
import { MessageResponseDto } from '../dto/response/message-response.dto';

export class MessageMapper {
  static toResponse(message: Message): MessageResponseDto {
    return {
      id: message.id,
      conversationId: message.conversation.id,
      senderId: message.sender.id,
      type: message.type,
      content: message.content,
      attachments: message.attachments,
      isEdited: message.isEdited,
      createdAt: message.createdAt,
    };
  }
}
