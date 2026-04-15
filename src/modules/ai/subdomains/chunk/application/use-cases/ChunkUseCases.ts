import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Chunk, type CreateChunkInput } from "../../domain/entities/Chunk";
import type { ChunkRepository } from "../../domain/repositories/ChunkRepository";

export class CreateChunkUseCase {
  constructor(private readonly repo: ChunkRepository) {}

  async execute(input: CreateChunkInput): Promise<CommandResult> {
    try {
      const chunk = Chunk.create(input);
      await this.repo.save(chunk.getSnapshot());
      return commandSuccess(chunk.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "CREATE_CHUNK_FAILED",
        err instanceof Error ? err.message : "Failed to create chunk",
      );
    }
  }
}

export class BulkCreateChunksUseCase {
  constructor(private readonly repo: ChunkRepository) {}

  async execute(inputs: CreateChunkInput[]): Promise<CommandResult> {
    try {
      const chunks = inputs.map((i) => Chunk.create(i));
      await this.repo.saveAll(chunks.map((c) => c.getSnapshot()));
      return commandSuccess(chunks.map((c) => c.id).join(","), Date.now());
    } catch (err) {
      return commandFailureFrom(
        "BULK_CREATE_CHUNKS_FAILED",
        err instanceof Error ? err.message : "Failed to bulk create chunks",
      );
    }
  }
}

export class GetChunksBySourceUseCase {
  constructor(private readonly repo: ChunkRepository) {}

  async execute(sourceId: string) {
    return this.repo.findBySourceId(sourceId);
  }
}
