import type {
  RetrievalChunkRefEntity,
  RetrievalSearchInput,
} from "../domain/entities/RetrievalChunkRef";
import type { RetrievalRepository } from "../domain/repositories/RetrievalRepository";

const DEFAULT_SEARCH_LIMIT = 20;

export class RetrievalRepoImpl implements RetrievalRepository {
  private readonly chunks = new Map<string, RetrievalChunkRefEntity>();

  private key(id: string, orgId: string): string {
    return `${orgId}:${id}`;
  }

  private toDate(value: Date | string | number): Date {
    return value instanceof Date ? new Date(value.getTime()) : new Date(value);
  }

  private clone(chunk: RetrievalChunkRefEntity): RetrievalChunkRefEntity {
    return {
      ...chunk,
      updatedAt: this.toDate(chunk.updatedAt),
    };
  }

  async findById(id: string, orgId: string): Promise<RetrievalChunkRefEntity | null> {
    const chunk = this.chunks.get(this.key(id, orgId));
    return chunk ? this.clone(chunk) : null;
  }

  async upsertChunk(chunk: RetrievalChunkRefEntity): Promise<void> {
    this.chunks.set(this.key(chunk.id, chunk.orgId), this.clone(chunk));
  }

  async searchChunks(input: RetrievalSearchInput): Promise<RetrievalChunkRefEntity[]> {
    const normalizedQuery = input.query?.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    const limit =
      input.limit && input.limit > 0 ? input.limit : DEFAULT_SEARCH_LIMIT;

    return Array.from(this.chunks.values())
      .filter((chunk) => chunk.orgId === input.orgId)
      .filter((chunk) =>
        input.taxonomyRef ? (chunk.taxonomyRef ?? "") === input.taxonomyRef : true,
      )
      .filter((chunk) => chunk.content.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return b.updatedAt.getTime() - a.updatedAt.getTime();
      })
      .slice(0, limit)
      .map((chunk) => this.clone(chunk));
  }
}
