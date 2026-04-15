import type { NotebookSnapshot } from "../../../domain/entities/Notebook";
import type { NotebookRepository } from "../../../domain/repositories/NotebookRepository";

export class InMemoryNotebookRepository implements NotebookRepository {
  private readonly store = new Map<string, NotebookSnapshot>();

  async save(snapshot: NotebookSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<NotebookSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findByWorkspaceId(workspaceId: string): Promise<NotebookSnapshot[]> {
    return Array.from(this.store.values()).filter((n) => n.workspaceId === workspaceId);
  }

  async findByAccountId(accountId: string): Promise<NotebookSnapshot[]> {
    return Array.from(this.store.values()).filter((n) => n.accountId === accountId);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
