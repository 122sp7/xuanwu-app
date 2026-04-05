/**
 * modules/notebook — domain repository interface: IThreadRepository
 */

import type { Thread } from "../entities/thread";

export interface IThreadRepository {
  save(accountId: string, thread: Thread): Promise<void>;
  getById(accountId: string, threadId: string): Promise<Thread | null>;
}
