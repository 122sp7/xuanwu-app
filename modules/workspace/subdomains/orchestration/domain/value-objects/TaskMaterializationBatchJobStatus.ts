/**
 * @module workspace-flow/domain/value-objects
 * @file TaskMaterializationBatchJobStatus.ts
 * @description Lifecycle statuses for task materialization batch jobs.
 */

export const TASK_MATERIALIZATION_BATCH_JOB_STATUSES = [
  "queued",
  "running",
  "partially_succeeded",
  "succeeded",
  "failed",
  "cancelled",
] as const;

export type TaskMaterializationBatchJobStatus =
  (typeof TASK_MATERIALIZATION_BATCH_JOB_STATUSES)[number];
