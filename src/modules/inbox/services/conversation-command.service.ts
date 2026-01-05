// src/modules/inbox/services/conversation-command.service.ts

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Conversation } from '../domain/entities/conversation.entity';
import { ConversationParticipant } from '../domain/entities/conversation-participant.entity';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { CreateConversationDto } from '../application/dto/create-conversation.dto';
import { Organization } from 'src/modules/organization/domain/entities/organization.entity';
import { ConversationStatusEnum } from '../domain/enum/conversation-status.enum';
import { EventBus } from '@nestjs/cqrs';
import { ConversationCreatedEvent } from '../events/conversation-created.event';
import { ConversationMapper } from '../application/mapping/conversation.mapper';
import { ConversationResponseDto } from '../application/dto/response/conversation-response.dto';

@Injectable()
export class ConversationCommandService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepo: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private participantRepo: Repository<ConversationParticipant>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
    private readonly eventBus: EventBus,
  ) {}

  async create(
    creatorId: string,
    organizationId: string,
    dto: CreateConversationDto,
  ): Promise<ConversationResponseDto> {
    const users = await this.userRepo.findBy({
      id: In([...dto.participantIds, creatorId]),
    });
    if (users.length < 2) throw new BadRequestException('Invalid participants');

    // 1️⃣ Validate organization
    const organization = await this.orgRepo.findOne({
      where: { id: organizationId },
    });
    if (!organization) throw new ForbiddenException('Organization not found');

    const conversation = this.conversationRepo.create({
      title: dto.title,
      type: dto.type,
      organization: { id: organizationId },
      campaign: dto.campaignId ? { id: dto.campaignId } : undefined,
      createdBy: { id: creatorId },
    });
    const savedConversation = await this.conversationRepo.save(conversation);

    const participants = dto.participantIds.map((p) =>
      this.participantRepo.create({
        conversation: savedConversation,
        user: { id: p.userId },
        role: p.role,
      }),
    );

    await this.participantRepo.save(participants);

    this.eventBus.publish(
      new ConversationCreatedEvent(
        savedConversation.id,
        organizationId,
        creatorId,
      ),
    );

    // ✅ Return RESPONSE DTO
    return ConversationMapper.toResponse(savedConversation);
  }

  async archiveConversation(conversationId: string) {
    await this.conversationRepo.update(conversationId, {
      status: ConversationStatusEnum.ARCHIVED,
    });
  }
}
