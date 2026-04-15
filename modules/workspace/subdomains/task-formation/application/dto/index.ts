/**
 * @module task-formation/application/dto
 * @file index.ts
 * @description Application-layer DTOs for the task-formation subdomain.
 */

import type { TaskFormationJobStatus } from "../../domain/value-objects/TaskFormationJobStatus";

export type { TaskFormationJob } from "../../domain/entities/TaskFormationJob";
export type { TaskFormationJobStatus } from "../../domain/value-objects/TaskFormationJobStatus";
export type {
  TaskCandidateSource,
  KnowledgeTextBlockInput,
  ExtractedTaskCandidate,
} from "../../domain/value-objects/TaskCandidate";

export interface SubmitTaskFormationJobDto {
  readonly workspaceId: string;
  readonly actorId: string;
  readonly correlationId?: string;
  readonly knowledgePageIds: ReadonlyArray<string>;
}

export interface ExtractTaskCandidatesDto {
  readonly knowledgePageId: string;
  readonly blocks: ReadonlyArray<{ readonly blockId: string; readonly text: string; readonly pageIndex?: number }>;
  readonly enableAiFallback?: boolean;
  readonly sourceContext?: {
    readonly filename?: string;
    readonly mimeType?: string;
    readonly pageCount?: number;
    readonly sourceGcsUri?: string;
    readonly jsonGcsUri?: string;
  };
}

export interface ExtractTaskCandidatesResult {
  readonly candidates: ReadonlyArray<{
    readonly title: string;
    readonly description?: string;
    readonly dueDate?: string;
    readonly source: "rule" | "ai";
    readonly confidence: number;
    readonly sourceBlockId?: string;
    readonly sourceSnippet?: string;
  }>;
  readonly usedAiFallback: boolean;
}

/** Lightweight summary projection for UI display. */
export interface TaskFormationJobSummary {
  readonly id: string;
  readonly workspaceId: string;
  readonly status: TaskFormationJobStatus;
  readonly totalItems: number;
  readonly processedItems: number;
  readonly succeededItems: number;
  readonly failedItems: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
