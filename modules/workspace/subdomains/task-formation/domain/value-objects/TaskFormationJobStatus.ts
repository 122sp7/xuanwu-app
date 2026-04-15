/**
 * @module task-formation/domain/value-objects
 * @file TaskFormationJobStatus.ts
 * @description Lifecycle statuses for task formation batch jobs.
 */

export const TASK_FORMATION_JOB_STATUSES = [
  "queued",
  "running",
  "partially_succeeded",
  "succeeded",
  "failed",
  "cancelled",
] as const;

export type TaskFormationJobStatus =
  (typeof TASK_FORMATION_JOB_STATUSES)[number];
