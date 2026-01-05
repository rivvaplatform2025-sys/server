import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationParticipant } from '../domain/entities/conversation-participant.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InboxAuthorizationService {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly participantRepo: Repository<ConversationParticipant>,
  ) {}

  async assertConversationAccess(
    userId: string,
    conversationId: string,
    organizationId: string,
  ): Promise<void> {
    const exists = await this.participantRepo.exists({
      where: {
        user: { id: userId },
        conversation: {
          id: conversationId,
          organization: { id: organizationId },
        },
        isActive: true,
      },
    });
    if (!exists) {
      throw new ForbiddenException(
        'You do not have access to this conversation',
      );
    }
  }
}
