import { Conversation } from '../../domain/entities/conversation.entity';
import { ConversationResponseDto } from '../dto/response/conversation-response.dto';

export class ConversationMapper {
  static toResponse(
    conversation: Conversation,
    unreadCount = 0,
  ): ConversationResponseDto {
    return {
      id: conversation.id,
      title: conversation.title,
      type: conversation.type,
      status: conversation.status,
      campaignId: conversation.campaign?.id,
      lastMessage: undefined,
      unreadCount,
      createdAt: conversation.createdAt,
    };
  }
}
