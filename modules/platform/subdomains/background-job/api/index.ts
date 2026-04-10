/**
 * Public API boundary for the background-job subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export * from "../infrastructure";
export type { IngestionDocument } from "../domain/entities/IngestionDocument";
export type { IngestionChunk, IngestionChunkMetadata } from "../domain/entities/IngestionChunk";
export type { IngestionJob } from "../domain/entities/IngestionJob";
export { canTransitionIngestionStatus } from "../domain/entities/IngestionJob";
