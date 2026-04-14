/**
 * Public API boundary for the background-job subdomain.
 * Cross-module consumers must import through this entry point.
 */

export * from "../application";
export { backgroundJobService } from "../interfaces/composition/background-job-service";
export type { JobDocument } from "../domain/entities/JobDocument";
export type { JobChunk, JobChunkMetadata } from "../domain/entities/JobChunk";
export type { BackgroundJob, BackgroundJobStatus } from "../domain/entities/BackgroundJob";
export { canTransitionJobStatus } from "../domain/entities/BackgroundJob";
