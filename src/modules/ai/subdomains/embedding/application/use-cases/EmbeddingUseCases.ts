import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { Embedding } from "../../domain/entities/Embedding";
import type { EmbeddingGenerationPort } from "../../domain/entities/Embedding";
import type { EmbeddingRepository } from "../../domain/repositories/EmbeddingRepository";

export class GenerateAndStoreEmbeddingUseCase {
  constructor(
    private readonly repo: EmbeddingRepository,
    private readonly port: EmbeddingGenerationPort,
  ) {}

  async execute(input: {
    chunkId: string;
    sourceId: string;
    text: string;
    model?: string;
  }): Promise<CommandResult> {
    try {
      const { vector, model } = await this.port.generateEmbedding(input.text, input.model);
      const embedding = Embedding.create({
        chunkId: input.chunkId,
        sourceId: input.sourceId,
        vector,
        model,
      });
      await this.repo.save(embedding.getSnapshot());
      return commandSuccess(embedding.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "GENERATE_EMBEDDING_FAILED",
        err instanceof Error ? err.message : "Failed to generate embedding",
      );
    }
  }
}
