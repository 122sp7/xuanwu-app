import { z } from "zod";
import { v4 as uuid } from "uuid";

export const EmbeddingIdSchema = z.string().uuid().brand("EmbeddingId");
export type EmbeddingId = z.infer<typeof EmbeddingIdSchema>;

export interface EmbeddingSnapshot {
  readonly id: string;
  readonly chunkId: string;
  readonly sourceId: string;
  readonly vector: number[];
  readonly model: string;
  readonly dimensions: number;
  readonly createdAtISO: string;
}

export interface CreateEmbeddingInput {
  readonly chunkId: string;
  readonly sourceId: string;
  readonly vector: number[];
  readonly model: string;
}

export class Embedding {
  private constructor(private readonly _props: EmbeddingSnapshot) {}

  static create(input: CreateEmbeddingInput): Embedding {
    return new Embedding({
      id: uuid(),
      chunkId: input.chunkId,
      sourceId: input.sourceId,
      vector: input.vector,
      model: input.model,
      dimensions: input.vector.length,
      createdAtISO: new Date().toISOString(),
    });
  }

  static reconstitute(snapshot: EmbeddingSnapshot): Embedding {
    return new Embedding(snapshot);
  }

  get id(): string { return this._props.id; }
  get chunkId(): string { return this._props.chunkId; }
  get vector(): number[] { return this._props.vector; }
  get model(): string { return this._props.model; }

  getSnapshot(): Readonly<EmbeddingSnapshot> {
    return Object.freeze({ ...this._props });
  }
}

export interface EmbeddingGenerationPort {
  generateEmbedding(text: string, model?: string): Promise<{ vector: number[]; model: string }>;
  generateEmbeddingBatch(texts: string[], model?: string): Promise<Array<{ vector: number[]; model: string }>>;
}
