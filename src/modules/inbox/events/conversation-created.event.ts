// src/modules/inbox/events/conversation-created.event.ts
export class ConversationCreatedEvent {
  constructor(
    public readonly conversationId: string,
    public readonly organizationId: string,
    public readonly createdByUserId?: string,
  ) {}
}
