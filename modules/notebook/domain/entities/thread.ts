/**
 * modules/notebook — domain entity: Thread
 */

import type { ID } from "@shared-types";
import type { Message } from "./message";

export interface Thread {
  readonly id: ID;
  readonly messages: Message[];
  readonly createdAt: string;
}
