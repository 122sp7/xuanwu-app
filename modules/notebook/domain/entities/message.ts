/**
 * modules/notebook — domain entity: Message
 */

import type { ID } from "@shared-types";

export type MessageRole = "user" | "assistant" | "system";

export interface Message {
  readonly id: ID;
  readonly role: MessageRole;
  readonly content: string;
  readonly createdAt: string;
}
