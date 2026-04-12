/**
 * Public API boundary for the conversation subdomain.
 *
 * Cross-module consumers MUST import through this entry point.
 */

export { ConversationPanel } from "../../../interfaces/conversation/components/ConversationPanel";
export type { ConversationPanelProps } from "../../../interfaces/conversation/components/ConversationPanel";

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
