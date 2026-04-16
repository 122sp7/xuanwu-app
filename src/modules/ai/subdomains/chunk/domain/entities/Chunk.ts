import { z } from "zod";
import { v4 as uuid } from "uuid";

export const ChunkIdSchema = z.string().uuid().brand("ChunkId");
export type ChunkId = z.infer<typeof ChunkIdSchema>;

export const ChunkStatusSchema = z.enum(["pending", "embedded", "indexed", "failed"]);
export type ChunkStatus = z.infer<typeof ChunkStatusSchema>;

export interface ChunkSnapshot {
  readonly id: string;
  readonly sourceId: string;
  readonly sourceType: string;
  readonly content: string;
  readonly order: number;
  readonly tokenCount?: number;
  readonly metadata: Record<string, unknown>;
  readonly status: ChunkStatus;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateChunkInput {
  readonly sourceId: string;
  readonly sourceType: string;
  readonly content: string;
  readonly order: number;
  readonly tokenCount?: number;
  readonly metadata?: Record<string, unknown>;
}

export class Chunk {
  private constructor(private _props: ChunkSnapshot) {}

  static create(input: CreateChunkInput): Chunk {
    const now = new Date().toISOString();
    return new Chunk({
      id: uuid(),
      sourceId: input.sourceId,
      sourceType: input.sourceType,
      content: input.content,
      order: input.order,
      tokenCount: input.tokenCount,
      metadata: input.metadata ?? {},
      status: "pending",
      createdAtISO: now,
      updatedAtISO: now,
    });
  }

  static reconstitute(snapshot: ChunkSnapshot): Chunk {
    return new Chunk(snapshot);
  }

  markEmbedded(): void {
    this._props = { ...this._props, status: "embedded", updatedAtISO: new Date().toISOString() };
  }

  markIndexed(): void {
    this._props = { ...this._props, status: "indexed", updatedAtISO: new Date().toISOString() };
  }

  markFailed(): void {
    this._props = { ...this._props, status: "failed", updatedAtISO: new Date().toISOString() };
  }

  get id(): string { return this._props.id; }
  get sourceId(): string { return this._props.sourceId; }
  get content(): string { return this._props.content; }
  get status(): ChunkStatus { return this._props.status; }

  getSnapshot(): Readonly<ChunkSnapshot> {
    return Object.freeze({ ...this._props });
  }
}
