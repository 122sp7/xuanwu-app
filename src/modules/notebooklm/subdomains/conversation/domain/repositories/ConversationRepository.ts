import type { ConversationSnapshot } from "../entities/Conversation";

export interface ConversationRepository {
  save(snapshot: ConversationSnapshot): Promise<void>;
  findById(id: string): Promise<ConversationSnapshot | null>;
  findByNotebookId(notebookId: string): Promise<ConversationSnapshot[]>;
  findByAccountId(accountId: string, limit?: number): Promise<ConversationSnapshot[]>;
  delete(id: string): Promise<void>;
}
