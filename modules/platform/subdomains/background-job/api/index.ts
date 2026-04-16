/**
 * Public API boundary for the background-job subdomain.
 * Cross-module consumers must import through this entry point.
 *
 * Explicit exports only — no wildcard re-exports of application/ (ADR 1404/5203).
 */

// ── Application DTOs (cross-module stable surface) ────────────────────────────
export type {
  JobResult,
  RegisterJobDocumentInput,
  AdvanceJobStageInput,
  ListWorkspaceJobsInput,
} from "../application/use-cases/background-job.use-cases";

// ── Service facade ────────────────────────────────────────────────────────────
export { backgroundJobService } from "../interfaces/composition/background-job-service";

// ── Domain types ──────────────────────────────────────────────────────────────
export type { JobDocument } from "../domain/entities/JobDocument";
export type { JobChunk, JobChunkMetadata } from "../domain/entities/JobChunk";
export type { BackgroundJob, BackgroundJobStatus } from "../domain/entities/BackgroundJob";
export { canTransitionJobStatus } from "../domain/entities/BackgroundJob";
