import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../domain/entities/message.entity';
import { Repository } from 'typeorm';
import { MessageResponseDto } from '../application/dto/response/message-response.dto';
import { PaginatedResponseDto } from 'src/shared/dto/paginated-response.dto';
import { PaginationDto } from 'src/shared/dto/pagination.dto';

@Injectable()
export class MessageQueryService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async getUserMessages(
    conversationId: string,
    pagination: PaginationDto,
  ): Promise<PaginatedResponseDto<MessageResponseDto>> {
    const page = pagination.getPage();
    const limit = pagination.getLimit();

    const qb = this.messageRepo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.sender', 'sender')
      .where('m.conversationId = :conversationId', { conversationId })
      .andWhere('m.isDeleted = false')
      .orderBy('m.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, totalItems] = await qb.getManyAndCount();

    const items: MessageResponseDto[] = rows.map((m) => ({
      id: m.id,
      conversationId,
      senderId: m.sender.id,
      type: m.type,
      content: m.content,
      attachments: m.attachments,
      isEdited: m.isEdited,
      createdAt: m.createdAt,
    }));

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
}
