/**
 * Public API boundary for the background-job subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export { ingestionService } from "../infrastructure/ingestion-service";
export type { IngestionDocument } from "../domain/entities/IngestionDocument";
export type { IngestionChunk, IngestionChunkMetadata } from "../domain/entities/IngestionChunk";
export type { IngestionJob, IngestionStatus } from "../domain/entities/IngestionJob";
export { canTransitionIngestionStatus } from "../domain/entities/IngestionJob";
