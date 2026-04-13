/**
 * notebooklm/conversation domain — public exports.
 */
export type { Thread } from "./entities/thread";
export type { Message } from "./entities/message";
export type { ThreadRepository } from "./repositories/ThreadRepository";
export * from "./ports";
export type {
  ThreadCreatedEvent,
  MessageAddedEvent,
  ThreadArchivedEvent,
} from "./events/ConversationEvents";
