import type { KnowledgeArtifactSnapshot, KnowledgeArtifactStatus, KnowledgeArtifactType } from "../../../domain/entities/KnowledgeArtifact";
import type { KnowledgeArtifactRepository, KnowledgeArtifactQuery } from "../../../domain/repositories/KnowledgeArtifactRepository";

export class InMemoryKnowledgeArtifactRepository implements KnowledgeArtifactRepository {
  private readonly store = new Map<string, KnowledgeArtifactSnapshot>();

  async save(snapshot: KnowledgeArtifactSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async findById(id: string): Promise<KnowledgeArtifactSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async query(params: KnowledgeArtifactQuery): Promise<KnowledgeArtifactSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.workspaceId) results = results.filter((a) => a.workspaceId === params.workspaceId);
    if (params.accountId) results = results.filter((a) => a.accountId === params.accountId);
    if (params.status) results = results.filter((a) => a.status === (params.status as KnowledgeArtifactStatus));
    if (params.type) results = results.filter((a) => a.type === (params.type as KnowledgeArtifactType));
    if (params.authorId) results = results.filter((a) => a.authorId === params.authorId);
    const offset = params.offset ?? 0;
    return results.slice(offset, offset + (params.limit ?? 100));
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
