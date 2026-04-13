/**
 * Module: notebooklm/subdomains/conversation
 * Layer: application/use-cases
 *
 * LoadThreadUseCase — retrieves a conversation thread by ID (query handler).
 * Returns null if the thread does not exist.
 */

import type { Thread } from "../../domain/entities/thread";
import type { ThreadRepository } from "../../domain/repositories/ThreadRepository";

export class LoadThreadUseCase {
  constructor(private readonly threadRepository: ThreadRepository) {}

  async execute(accountId: string, threadId: string): Promise<Thread | null> {
    if (!accountId || !threadId) return null;
    return this.threadRepository.getById(accountId, threadId);
  }
}
