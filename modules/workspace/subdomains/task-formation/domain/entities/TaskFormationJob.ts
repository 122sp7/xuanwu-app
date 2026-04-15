/**
 * @module task-formation/domain/entities
 * @file TaskFormationJob.ts
 * @description Batch job entity for AI-assisted task formation from knowledge content.
 */

import type { TaskFormationJobStatus } from "../value-objects/TaskFormationJobStatus";

export interface TaskFormationJob {
  readonly id: string;
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly status: TaskFormationJobStatus;
  readonly startedAtISO?: string;
  readonly completedAtISO?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateTaskFormationJobInput {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}

export interface CompleteTaskFormationJobInput {
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
}
