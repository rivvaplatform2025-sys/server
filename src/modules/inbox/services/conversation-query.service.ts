import { Injectable } from '@nestjs/common';
import { ConversationParticipant } from '../domain/entities/conversation-participant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/shared/dto/pagination.dto';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { ConversationResponseDto } from '../application/dto/response/conversation-response.dto';
import { Message } from '../domain/entities/message.entity';

@Injectable()
export class ConversationQueryService {
  constructor(
    @InjectRepository(ConversationParticipant)
    private readonly participantRepo: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async getInbox(
    userId: string,
    organizationId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<ConversationResponseDto>> {
    const page = pagination.getPage();
    const limit = pagination.getLimit();

    /**
     * Query rationale:
     * - Drive from ConversationParticipant (user-specific)
     * - Join Conversation once
     * - Avoid heavy message joins
     */
    const qb = this.participantRepo
      .createQueryBuilder('cp')
      .innerJoinAndSelect('cp.conversation', 'c')
      .where('cp.userId = :userId', { userId })
      .andWhere('c.organizationId = :organizationId', {
        organizationId,
      })
      .andWhere('cp.isActive = true')
      .andWhere('c.deletedAt IS NULL')
      .orderBy('c.lastMessageAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, totalItems] = await qb.getManyAndCount();

    const items = await Promise.all(
      rows.map(async (cp) => {
        const unreadCount = await this.getUnreadCount(
          cp.conversation.id,
          cp.lastReadMessageId!,
          userId,
        );

        return {
          id: cp.conversation.id,
          title: cp.conversation.title,
          type: cp.conversation.type,
          status: cp.conversation.status,
          campaignId: cp.conversation.campaign?.id,
          lastMessage: cp.conversation.lastMessageAt
            ? {
                id: cp.conversation.lastMessageId!,
                content: undefined,
                senderId: '',
                createdAt: cp.conversation.lastMessageAt,
              }
            : undefined,
          unreadCount,
          createdAt: cp.conversation.createdAt,
        };
      }),
    );

    return {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        items,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      },
    };
  }

  /**
   * 🔥 Real unread count SQL
   */
  private async getUnreadCount(
    conversationId: string,
    lastReadMessageId: string | null,
    userId: string,
  ): Promise<number> {
    const qb = this.messageRepo
      .createQueryBuilder('m')
      .where('m.conversationId = :conversationId', {
        conversationId,
      })
      .andWhere('m.senderId != :userId', { userId });

    if (lastReadMessageId) {
      qb.andWhere(
        `m.createdAt > (
          SELECT m2.createdAt FROM messages m2 WHERE m2.id = :lastReadMessageId
        )`,
        { lastReadMessageId },
      );
    }

    return qb.getCount();
  }
}
