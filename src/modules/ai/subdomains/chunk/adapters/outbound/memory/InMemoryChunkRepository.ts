import type { ChunkSnapshot, ChunkStatus } from "../../../domain/entities/Chunk";
import type { ChunkRepository, ChunkQuery } from "../../../domain/repositories/ChunkRepository";

export class InMemoryChunkRepository implements ChunkRepository {
  private readonly store = new Map<string, ChunkSnapshot>();

  async save(snapshot: ChunkSnapshot): Promise<void> {
    this.store.set(snapshot.id, snapshot);
  }

  async saveAll(snapshots: ChunkSnapshot[]): Promise<void> {
    for (const s of snapshots) this.store.set(s.id, s);
  }

  async findById(id: string): Promise<ChunkSnapshot | null> {
    return this.store.get(id) ?? null;
  }

  async findBySourceId(sourceId: string): Promise<ChunkSnapshot[]> {
    return Array.from(this.store.values()).filter((c) => c.sourceId === sourceId);
  }

  async query(params: ChunkQuery): Promise<ChunkSnapshot[]> {
    let results = Array.from(this.store.values());
    if (params.sourceId) results = results.filter((c) => c.sourceId === params.sourceId);
    if (params.status) results = results.filter((c) => c.status === (params.status as ChunkStatus));
    const offset = params.offset ?? 0;
    const limit = params.limit ?? 1000;
    return results.slice(offset, offset + limit);
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async deleteBySourceId(sourceId: string): Promise<void> {
    for (const [id, chunk] of this.store) {
      if (chunk.sourceId === sourceId) this.store.delete(id);
    }
  }
}
