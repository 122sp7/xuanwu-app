/**
 * Conversation subdomain — UI component surface.
 *
 * Separated from the main barrel (index.ts) because ConversationPanel imports
 * workspace/api at runtime, creating a synchronous evaluation cycle when the
 * full barrel is loaded by workspace interfaces.
 *
 * Consumers that need ConversationPanel should either:
 *  - import from this file directly, or
 *  - use `next/dynamic` to lazy-load from this path.
 */

export {
  ConversationPanel,
  type ConversationPanelProps,
} from "../../../interfaces/conversation/components/ConversationPanel";
