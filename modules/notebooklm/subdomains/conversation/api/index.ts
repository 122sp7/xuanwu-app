/**
 * Public API boundary for the conversation subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 */

export { ConversationScreen } from "../../../interfaces/conversation/components/AiChatPage";
export type { ConversationScreenProps } from "../../../interfaces/conversation/components/AiChatPage";

export type { ChatMessage } from "../../../interfaces/conversation/helpers";
export {
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "../../../interfaces/conversation/helpers";

// Domain types
export type { Message, MessageRole } from "../domain/entities/message";
export type { Thread } from "../domain/entities/thread";
export type { IThreadRepository } from "../domain/repositories/IThreadRepository";

// Thread persistence actions
export { saveThread, loadThread } from "../../../interfaces/conversation/_actions/thread.actions";
