// src/modules/inbox/events/handlers/message-sent.handler.ts

import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MessageSentEvent } from '../message-sent.event';
import { Injectable } from '@nestjs/common';

@EventsHandler(MessageSentEvent)
@Injectable()
export class MessageSentEventHandler implements IEventHandler<MessageSentEvent> {
  handle(event: MessageSentEvent) {
    // 1️⃣ Log audit
    console.log(
      `Conversation ${event.conversationId} created in org ${event.senderId}`,
    );
    // 🔔 Notify participants
    // 🔄 Update lastMessageAt
    // 📊 Update unread counters
    // 🌍 Push websocket / Supabase Realtime
  }
}
