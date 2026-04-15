/**
 * @module workspace-flow/domain/entities
 * @file TaskMaterializationBatchJob.ts
 * @description Batch job aggregate for task materialization orchestration.
 */

import type { TaskMaterializationBatchJobStatus } from "../value-objects/TaskMaterializationBatchJobStatus";

export interface TaskMaterializationBatchJob {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: TaskMaterializationBatchJobStatus;
  readonly startedAtISO?: string;
  readonly completedAtISO?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaskMaterializationBatchJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}

export interface CompleteTaskMaterializationBatchJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}
