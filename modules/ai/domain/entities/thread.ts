/**
 * modules/ai — domain entity: Thread
 *
 * A Thread is the aggregate that groups a sequence of Messages for a single
 * AI conversation session.
 */

import type { ID } from "@shared-types";
import type { Message } from "./message";

/** An AI conversation thread */
export interface Thread {
  /** Unique identifier */
  readonly id: ID;
  /** Ordered list of messages in this thread */
  readonly messages: Message[];
  /** Timestamp the thread was created (ISO 8601) */
  readonly createdAt: string;
}
