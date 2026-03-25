import type { IngestionDocument } from "./IngestionDocument";

export type IngestionStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";

export const ALLOWED_INGESTION_STATUS_TRANSITIONS: Readonly<
  Record<IngestionStatus, readonly IngestionStatus[]>
> = {
  uploaded: ["parsing", "failed"],
  parsing: ["chunking", "failed"],
  chunking: ["embedding", "failed"],
  embedding: ["indexed", "failed"],
  indexed: ["stale", "re-indexing"],
  stale: ["re-indexing"],
  "re-indexing": ["parsing", "failed"],
  failed: ["re-indexing"],
};

export function canTransitionIngestionStatus(
  fromStatus: IngestionStatus,
  toStatus: IngestionStatus,
): boolean {
  return ALLOWED_INGESTION_STATUS_TRANSITIONS[fromStatus].includes(toStatus);
}

export interface IngestionJob {
  readonly id: string;
  readonly document: IngestionDocument;
  readonly status: IngestionStatus;
  readonly statusMessage?: string;
  readonly updatedAtISO: string;
}
