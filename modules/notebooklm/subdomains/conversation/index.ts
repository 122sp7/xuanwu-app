/**
 * notebooklm/subdomains/conversation — public API barrel.
 *
 * Exposes UI components and helpers for the conversation (AI chat) subdomain.
 */

export { AiChatPage } from "./interfaces/components/AiChatPage";
export type { AiChatPageProps } from "./interfaces/components/AiChatPage";

export type { ChatMessage } from "./interfaces/helpers";
export {
  STORAGE_KEY,
  buildContextPrompt,
  generateMsgId,
  threadFromMessages,
} from "./interfaces/helpers";
