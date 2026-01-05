// src/modules/inbox/events/handlers/conversation-created.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ConversationCreatedEvent } from '../conversation-created.event';
import { Injectable } from '@nestjs/common';

@EventsHandler(ConversationCreatedEvent)
@Injectable()
export class ConversationCreatedEventHandler implements IEventHandler<ConversationCreatedEvent> {
  handle(event: ConversationCreatedEvent) {
    // Examples of side effects 👇

    // 1️⃣ Log audit
    console.log(
      `Conversation ${event.conversationId} created in org ${event.organizationId}`,
    );

    // 2️⃣ Emit websocket event
    // 3️⃣ Notify participants
    // 4️⃣ Analytics
  }
}
