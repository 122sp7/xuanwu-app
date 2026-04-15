/**
 * @module task-formation/infrastructure/firebase
 * @file task-formation-job.converter.ts
 * @description Firestore document-to-entity converter for task formation jobs.
 */

import type { TaskFormationJob } from "../../domain/entities/TaskFormationJob";
import {
  TASK_FORMATION_JOB_STATUSES,
  type TaskFormationJobStatus,
} from "../../domain/value-objects/TaskFormationJobStatus";

const VALID_STATUSES = new Set<TaskFormationJobStatus>(TASK_FORMATION_JOB_STATUSES);

export function toTaskFormationJob(
  id: string,
  raw: Record<string, unknown>,
): TaskFormationJob {
  const parsedStatus =
    typeof raw.status === "string" &&
    VALID_STATUSES.has(raw.status as TaskFormationJobStatus)
      ? (raw.status as TaskFormationJobStatus)
      : "queued";

  const knowledgePageIds = Array.isArray(raw.knowledgePageIds)
    ? raw.knowledgePageIds.filter((item): item is string => typeof item === "string")
    : [];

  return {
    id,
    workspaceId: String(raw.workspaceId ?? ""),
    actorId: String(raw.actorId ?? ""),
    correlationId: String(raw.correlationId ?? ""),
    knowledgePageIds,
    totalItems: Number(raw.totalItems ?? 0),
    processedItems: Number(raw.processedItems ?? 0),
    succeededItems: Number(raw.succeededItems ?? 0),
    failedItems: Number(raw.failedItems ?? 0),
    status: parsedStatus,
    startedAtISO: typeof raw.startedAtISO === "string" ? raw.startedAtISO : undefined,
    completedAtISO: typeof raw.completedAtISO === "string" ? raw.completedAtISO : undefined,
    errorCode: typeof raw.errorCode === "string" ? raw.errorCode : undefined,
    errorMessage: typeof raw.errorMessage === "string" ? raw.errorMessage : undefined,
    createdAtISO: String(raw.createdAtISO ?? new Date().toISOString()),
    updatedAtISO: String(raw.updatedAtISO ?? new Date().toISOString()),
  };
}
