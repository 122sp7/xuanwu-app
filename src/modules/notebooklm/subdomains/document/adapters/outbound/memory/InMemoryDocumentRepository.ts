import type { DocumentSnapshot, DocumentStatus } from "../../../domain/entities/Document";
import type { DocumentRepository, DocumentQuery } from "../../../domain/repositories/DocumentRepository";

export class InMemoryDocumentRepository implements DocumentRepository {
  private readonly store = new Map<string, DocumentSnapshot>();

  async save(snapshot: DocumentSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<DocumentSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findByNotebookId(notebookId: string): Promise<DocumentSnapshot[]> {
    return Array.from(this.store.values()).filter((d) => d.notebookId === notebookId);
  }

  async query(params: DocumentQuery): Promise<DocumentSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.notebookId) results = results.filter((d) => d.notebookId === params.notebookId);
    if (params.workspaceId) results = results.filter((d) => d.workspaceId === params.workspaceId);
    if (params.accountId) results = results.filter((d) => d.accountId === params.accountId);
    if (params.status) results = results.filter((d) => d.status === (params.status as DocumentStatus));
    const offset = params.offset ?? 0;
    return results.slice(offset, offset + (params.limit ?? 100));
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
