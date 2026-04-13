/**
 * Public API boundary for the conversation subdomain.
 *
 * Cross-module consumers MUST import through this entry point for
 * data, types, and helpers.
 *
 * UI components (ConversationPanel) are in a separate `./ui` entry
 * to avoid synchronous module-evaluation cycles with workspace/api.
 * Import ConversationPanel from `conversation/api/ui` or use
 * `next/dynamic` for lazy loading.
 */

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
export type { ThreadRepository } from "../domain/repositories/ThreadRepository";

// Thread persistence actions
export { saveThread, loadThread } from "../../../interfaces/conversation/_actions/thread.actions";
