import type { IngestionSourceSnapshot, SourceStatus } from "../../../domain/entities/IngestionSource";
import type { IngestionSourceRepository, IngestionSourceQuery } from "../../../domain/repositories/IngestionSourceRepository";

export class InMemoryIngestionSourceRepository implements IngestionSourceRepository {
  private readonly store = new Map<string, IngestionSourceSnapshot>();

  async save(snapshot: IngestionSourceSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<IngestionSourceSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findByNotebookId(notebookId: string): Promise<IngestionSourceSnapshot[]> {
    return Array.from(this.store.values()).filter((s) => s.notebookId === notebookId);
  }

  async query(params: IngestionSourceQuery): Promise<IngestionSourceSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.notebookId) results = results.filter((s) => s.notebookId === params.notebookId);
    if (params.workspaceId) results = results.filter((s) => s.workspaceId === params.workspaceId);
    if (params.accountId) results = results.filter((s) => s.accountId === params.accountId);
    if (params.status) results = results.filter((s) => s.status === (params.status as SourceStatus));
    const offset = params.offset ?? 0;
    return results.slice(offset, offset + (params.limit ?? 100));
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
