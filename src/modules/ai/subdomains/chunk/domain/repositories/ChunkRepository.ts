import type { ChunkSnapshot, ChunkStatus } from "../entities/Chunk";

export interface ChunkQuery {
  readonly sourceId?: string;
  readonly status?: ChunkStatus;
  readonly limit?: number;
  readonly offset?: number;
}

export interface ChunkRepository {
  save(snapshot: ChunkSnapshot): Promise<void>;
  saveAll(snapshots: ChunkSnapshot[]): Promise<void>;
  findById(id: string): Promise<ChunkSnapshot | null>;
  findBySourceId(sourceId: string): Promise<ChunkSnapshot[]>;
  query(params: ChunkQuery): Promise<ChunkSnapshot[]>;
  delete(id: string): Promise<void>;
  deleteBySourceId(sourceId: string): Promise<void>;
}
