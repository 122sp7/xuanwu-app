/**
 * Module: notebooklm/subdomains/conversation
 * Layer: application/use-cases
 *
 * SaveThreadUseCase — persists a conversation thread via the repository port.
 * Validates required fields before delegating to infrastructure.
 */

import type { Thread } from "../../domain/entities/thread";
import type { IThreadRepository } from "../../domain/repositories/IThreadRepository";

export class SaveThreadUseCase {
  constructor(private readonly threadRepository: IThreadRepository) {}

  async execute(accountId: string, thread: Thread): Promise<void> {
    if (!accountId || !thread.id) {
      throw new Error("accountId and thread.id are required to save a thread.");
    }
    await this.threadRepository.save(accountId, thread);
  }
}
