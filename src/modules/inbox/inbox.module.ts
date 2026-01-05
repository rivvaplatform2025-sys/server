// src/modules/inbox/inbox.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Conversation } from './domain/entities/conversation.entity';
import { ConversationParticipant } from './domain/entities/conversation-participant.entity';
import { Message } from './domain/entities/message.entity';
import { ConversationCommandService } from './services/conversation-command.service';
import { ConversationQueryService } from './services/conversation-query.service';
import { InboxAuthorizationService } from './services/inbox-authorization.service';
import { MessageCommandService } from './services/message-command.service';
import { MessageQueryService } from './services/message-query.service';
import { ConversationController } from './controllers/conversation.controller';
import { MessageController } from './controllers/message.controller';
import { ConversationCreatedEventHandler } from './events/handlers/conversation-created.handler';
import { MessageSentEventHandler } from './events/handlers/message-sent.handler';
import { User } from '../users/domain/entities/user.entity';
import { Organization } from '../organization/domain/entities/organization.entity';

const CommandServices = [ConversationCommandService, MessageCommandService];
const QueryServices = [ConversationQueryService, MessageQueryService];
const EventHandlers = [
  ConversationCreatedEventHandler,
  MessageSentEventHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      ConversationParticipant,
      Message,
      User,
      Organization,
    ]),
    CqrsModule,
  ],
  providers: [
    ...CommandServices,
    ...QueryServices,
    ...EventHandlers,
    InboxAuthorizationService,
  ],
  controllers: [ConversationController, MessageController],
  // exports: [
  //   //TypeOrmModule,
  //   ConversationQueryService,
  //   MessageQueryService,
  //   InboxAuthorizationService,
  // ],
})
export class InboxModule {}
