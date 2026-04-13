/**
 * Module: notebooklm/subdomains/conversation
 * Layer: domain/events
 * Purpose: Domain events for conversation operations.
 */

import type { NotebookLmDomainEvent } from "../../../../domain/events/NotebookLmDomainEvent";

export interface ThreadCreatedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.conversation.thread-created";
  readonly payload: {
    readonly threadId: string;
    readonly accountId: string;
  };
}

export interface MessageAddedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.conversation.message-added";
  readonly payload: {
    readonly threadId: string;
    readonly messageId: string;
    readonly role: "user" | "assistant" | "system";
    readonly accountId: string;
  };
}

export interface ThreadArchivedEvent extends NotebookLmDomainEvent {
  readonly type: "notebooklm.conversation.thread-archived";
  readonly payload: {
    readonly threadId: string;
    readonly accountId: string;
  };
}
