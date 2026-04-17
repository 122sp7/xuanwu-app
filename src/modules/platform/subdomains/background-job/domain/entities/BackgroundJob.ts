import type { JobDocument } from "./JobDocument";

export type BackgroundJobStatus =
  | "uploaded"
  | "parsing"
  | "chunking"
  | "embedding"
  | "indexed"
  | "stale"
  | "re-indexing"
  | "failed";

const ALLOWED_TRANSITIONS: Readonly<Record<BackgroundJobStatus, readonly BackgroundJobStatus[]>> = {
  uploaded: ["parsing", "failed"],
  parsing: ["chunking", "failed"],
  chunking: ["embedding", "failed"],
  embedding: ["indexed", "failed"],
  indexed: ["stale", "re-indexing"],
  stale: ["re-indexing"],
  "re-indexing": ["parsing", "failed"],
  failed: ["re-indexing"],
};

export function canTransitionJobStatus(from: BackgroundJobStatus, to: BackgroundJobStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export interface BackgroundJob {
  readonly id: string;
  readonly document: JobDocument;
  readonly status: BackgroundJobStatus;
  readonly statusMessage?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
