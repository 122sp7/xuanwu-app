/**
 * @module workspace-flow/infrastructure/firebase
 * @file task-materialization-batch-job.converter.ts
 * @description Firestore document-to-entity converter for task materialization batch jobs.
 */

import type { TaskMaterializationBatchJob } from "../../domain/entities/TaskMaterializationBatchJob";
import {
  TASK_MATERIALIZATION_BATCH_JOB_STATUSES,
  type TaskMaterializationBatchJobStatus,
} from "../../domain/value-objects/TaskMaterializationBatchJobStatus";

const VALID_STATUSES = new Set<TaskMaterializationBatchJobStatus>(TASK_MATERIALIZATION_BATCH_JOB_STATUSES);

export function toTaskMaterializationBatchJob(
  id: string,
  raw: Record<string, unknown>,
): TaskMaterializationBatchJob {
  const parsedStatus =
    typeof raw.status === "string" && VALID_STATUSES.has(raw.status as TaskMaterializationBatchJobStatus)
      ? (raw.status as TaskMaterializationBatchJobStatus)
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
    createdAtISO: String(raw.createdAtISO ?? ""),
    updatedAtISO: String(raw.updatedAtISO ?? ""),
  };
}
