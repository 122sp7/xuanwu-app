/**
 * modules/ai — domain entity: Message
 *
 * A single message exchanged within an AI conversation Thread.
 */

import type { ID } from "@shared-types";

/** Who authored the message */
export type MessageRole = "user" | "assistant" | "system";

/** A single turn in a conversation */
export interface Message {
  /** Unique identifier */
  readonly id: ID;
  /** Author role */
  readonly role: MessageRole;
  /** Text content of the message */
  readonly content: string;
  /** Timestamp (ISO 8601) */
  readonly createdAt: string;
}
