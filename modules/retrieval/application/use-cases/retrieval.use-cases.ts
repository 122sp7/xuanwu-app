import { commandFailureFrom, commandSuccess } from "@/shared/types";
import type { CommandResult } from "@/shared/types";
import type {
  RetrievalChunkRefEntity,
  RetrievalSearchInput,
} from "../../domain/entities/RetrievalChunkRef";
import type { RetrievalRepository } from "../../domain/repositories/RetrievalRepository";

export class UpsertRetrievalChunkUseCase {
  constructor(
    private readonly retrievalRepository: RetrievalRepository,
    private readonly idGenerator: () => string = () => crypto.randomUUID(),
  ) {}

  async execute(input: {
    orgId: string;
    documentId: string;
    content: string;
    taxonomyRef?: string;
    chunkId?: string;
    score?: number;
  }): Promise<CommandResult> {
    try {
      if (!input.orgId?.trim()) {
        return commandFailureFrom("RETRIEVAL_ORG_REQUIRED", "orgId is required");
      }

      if (!input.content?.trim()) {
        return commandFailureFrom("RETRIEVAL_CONTENT_REQUIRED", "content is required");
      }

      if (!input.documentId?.trim()) {
        return commandFailureFrom("RETRIEVAL_DOCUMENT_REQUIRED", "documentId is required");
      }

      const chunkId = input.chunkId ?? this.idGenerator();
      const existing = await this.retrievalRepository.findById(chunkId, input.orgId);
      const chunk: RetrievalChunkRefEntity = {
        id: chunkId,
        orgId: input.orgId,
        documentId: input.documentId,
        content: input.content,
        taxonomyRef: input.taxonomyRef,
        score: input.score ?? existing?.score ?? 0,
        version: existing ? existing.version + 1 : 1,
        updatedAt: new Date(),
      };

      await this.retrievalRepository.upsertChunk(chunk);
      return commandSuccess(chunk.id, chunk.version);
    } catch (err) {
      return commandFailureFrom(
        "RETRIEVAL_UPSERT_FAILED",
        err instanceof Error ? err.message : "Failed to upsert retrieval chunk",
      );
    }
  }
}

export class SearchRetrievalChunksUseCase {
  constructor(private readonly retrievalRepository: RetrievalRepository) {}

  async execute(input: RetrievalSearchInput): Promise<RetrievalChunkRefEntity[]> {
    if (!input.orgId?.trim() || !input.query?.trim()) {
      return [];
    }

    try {
      return this.retrievalRepository.searchChunks(input);
    } catch {
      return [];
    }
  }
}
