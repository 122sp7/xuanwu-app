/**
 * Conversation — distilled from modules/notebooklm/subdomains/conversation
 * Owns thread-based AI conversations linked to a notebook.
 */
import { v4 as uuid } from "@lib-uuid";

export type MessageRole = "user" | "assistant" | "system";

export interface ConversationMessage {
  readonly id: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAtISO: string;
}

export interface ConversationSnapshot {
  readonly id: string;
  readonly notebookId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly messages: ConversationMessage[];
  readonly title?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface StartConversationInput {
  readonly notebookId: string;
  readonly workspaceId: string;
  readonly accountId: string;
  readonly title?: string;
}

export class Conversation {
  private _domainEvents: Array<{ type: string; eventId: string; occurredAt: string; payload: Record<string, unknown> }> = [];

  private constructor(private _props: ConversationSnapshot) {}

  static start(input: StartConversationInput): Conversation {
    const now = new Date().toISOString();
    const conv = new Conversation({
      id: uuid(),
      notebookId: input.notebookId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      messages: [],
      title: input.title,
      createdAtISO: now,
      updatedAtISO: now,
    });
    conv._domainEvents.push({
      type: "notebooklm.conversation.started",
      eventId: uuid(),
      occurredAt: now,
      payload: { conversationId: conv._props.id, notebookId: input.notebookId },
    });
    return conv;
  }

  static reconstitute(snapshot: ConversationSnapshot): Conversation {
    return new Conversation(snapshot);
  }

  addMessage(role: MessageRole, content: string): string {
    const msgId = uuid();
    const msg: ConversationMessage = { id: msgId, role, content, createdAtISO: new Date().toISOString() };
    this._props = {
      ...this._props,
      messages: [...this._props.messages, msg],
      updatedAtISO: new Date().toISOString(),
    };
    return msgId;
  }

  get id(): string { return this._props.id; }
  get notebookId(): string { return this._props.notebookId; }
  get messages(): ConversationMessage[] { return [...this._props.messages]; }
  get workspaceId(): string { return this._props.workspaceId; }

  getSnapshot(): Readonly<ConversationSnapshot> {
    return Object.freeze({ ...this._props });
  }

  pullDomainEvents() {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }
}
