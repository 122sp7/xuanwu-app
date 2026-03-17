import type {
  RetrievalChunkRefEntity,
  RetrievalSearchInput,
} from "../entities/RetrievalChunkRef";

export interface RetrievalRepository {
  findById(id: string, orgId: string): Promise<RetrievalChunkRefEntity | null>;
  upsertChunk(chunk: RetrievalChunkRefEntity): Promise<void>;
  searchChunks(input: RetrievalSearchInput): Promise<RetrievalChunkRefEntity[]>;
}
