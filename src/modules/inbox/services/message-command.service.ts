import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Message } from '../domain/entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from '../domain/entities/conversation.entity';
import { SendMessageDto } from '../application/dto/send-message.dto';
import { MessageSentEvent } from '../events/message-sent.event';
import { MessageResponseDto } from '../application/dto/response/message-response.dto';
import { MessageMapper } from '../application/mapping/message.mapper';

@Injectable()
export class MessageCommandService {
  constructor(
    @InjectRepository(Message)
    private messageRepo: Repository<Message>,
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    private readonly eventBus: EventBus,
  ) {}

  async sendMessage(
    dto: SendMessageDto,
    senderId: string,
  ): Promise<MessageResponseDto> {
    const message = this.messageRepo.create({
      conversation: { id: dto.conversationId },
      sender: { id: senderId },
      type: dto.type,
      content: dto.content,
      attachments: dto.attachments,
    });
    const saved = await this.messageRepo.save(message);

    await this.conversationRepo.update(dto.conversationId, {
      lastMessageId: saved.id,
      lastMessageAt: saved.createdAt,
    });

    this.eventBus.publish(
      new MessageSentEvent(saved.id, dto.conversationId, senderId),
    );

    // ✅ Return RESPONSE DTO
    return MessageMapper.toResponse(saved);
  }
}
