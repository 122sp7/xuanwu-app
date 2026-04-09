// ── background-job subdomain public surface ───────────────────────────────────
// All cross-module consumers must import from @/modules/platform/api, never from
// this path directly.

export * from "./application";
export * from "./adapters";
export type { IngestionDocument } from "./domain/entities/IngestionDocument";
export type { IngestionChunk, IngestionChunkMetadata } from "./domain/entities/IngestionChunk";
export type { IngestionJob } from "./domain/entities/IngestionJob";
export { canTransitionIngestionStatus } from "./domain/entities/IngestionJob";