/**
 * Public API boundary for the conversation subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 */

export { AiChatPage } from "../interfaces/components/AiChatPage";
export type { AiChatPageProps } from "../interfaces/components/AiChatPage";

export type { ChatMessage } from "../interfaces/helpers";
export {
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../interfaces/helpers";

// Domain types
export type { Message, MessageRole } from "../domain/entities/message";
export type { Thread } from "../domain/entities/thread";
export type { IThreadRepository } from "../domain/repositories/IThreadRepository";

// Thread persistence actions
export { saveThread, loadThread } from "../interfaces/_actions/thread.actions";
