import type { ConversationSnapshot } from "../../../domain/entities/Conversation";
import type { ConversationRepository } from "../../../domain/repositories/ConversationRepository";

export class InMemoryConversationRepository implements ConversationRepository {
  private readonly store = new Map<string, ConversationSnapshot>();

  async save(snapshot: ConversationSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<ConversationSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]> {
    return Array.from(this.store.values()).filter((c) => c.notebookId === notebookId);
  }

  async findByAccountId(accountId: string, limit = 50): Promise<ConversationSnapshot[]> {
    return Array.from(this.store.values())
      .filter((c) => c.accountId === accountId)
      .slice(0, limit);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
