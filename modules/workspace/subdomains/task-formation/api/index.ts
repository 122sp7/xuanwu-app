/**
 * @module task-formation/api
 * @file index.ts
 * @description Public cross-subdomain boundary for task-formation.
 *
 * Consumers within the workspace module MUST import only from this path.
 * Never import from domain/, application/, infrastructure/, or interfaces/ directly.
 */

// ── Domain types ──────────────────────────────────────────────────────────────

export type { TaskFormationJob } from "../domain/entities/TaskFormationJob";
export type { TaskFormationJobStatus } from "../domain/value-objects/TaskFormationJobStatus";
export type {
  TaskCandidateSource,
  KnowledgeTextBlockInput,
  ExtractedTaskCandidate,
} from "../domain/value-objects/TaskCandidate";

// ── Application DTOs ──────────────────────────────────────────────────────────

export type {
  TaskFormationJobSummary,
  SubmitTaskFormationJobDto,
  ExtractTaskCandidatesDto,
  ExtractTaskCandidatesResult,
} from "../application/dto/index";

// ── Factories ─────────────────────────────────────────────────────────────────

export { makeTaskFormationJobRepo } from "./factories";

// ── Read queries ──────────────────────────────────────────────────────────────

export {
  getTaskFormationJob,
  listTaskFormationJobs,
} from "../interfaces/queries/task-formation.queries";

// ── Server actions ────────────────────────────────────────────────────────────

export {
  tfSubmitFormationJob,
  tfExtractTaskCandidates,
  tfGetFormationJob,
  tfListFormationJobs,
} from "../interfaces/_actions/task-formation.actions";

// ── UI components ─────────────────────────────────────────────────────────────

export { WorkspaceTaskFormationPanel } from "../interfaces/components/WorkspaceTaskFormationPanel";
