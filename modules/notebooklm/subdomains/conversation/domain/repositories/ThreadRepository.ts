/**
 * modules/notebook — domain repository interface: ThreadRepository
 */

import type { Thread } from "../entities/thread";

export interface ThreadRepository {
  save(accountId: string, thread: Thread): Promise<void>;
  getById(accountId: string, threadId: string): Promise<Thread | null>;
}
