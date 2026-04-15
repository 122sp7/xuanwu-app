/**
 * @module orchestration/interfaces/contracts
 * @file workspace-flow-orchestration.contract.ts
 * @description Summary projections for task materialization batch job.
 */

import type { TaskMaterializationBatchJob } from "../../domain/entities/TaskMaterializationBatchJob";

export interface TaskMaterializationBatchJobSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: TaskMaterializationBatchJob["status"];
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly updatedAtISO: string;
}

export function toTaskMaterializationBatchJobSummary(
  job: TaskMaterializationBatchJob,
): TaskMaterializationBatchJobSummary {
  return {
    id: job.id,
    workspaceId: job.workspaceId,
    status: job.status,
    totalItems: job.totalItems,
    processedItems: job.processedItems,
    succeededItems: job.succeededItems,
    failedItems: job.failedItems,
    updatedAtISO: job.updatedAtISO,
  };
}
