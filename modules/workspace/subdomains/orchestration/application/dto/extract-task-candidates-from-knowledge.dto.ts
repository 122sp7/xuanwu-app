/**
 * @module workspace-flow/application/dto
 * @file extract-task-candidates-from-knowledge.dto.ts
 * @description Application-layer DTOs for the ExtractTaskCandidatesFromKnowledge use case.
 *
 * Pure value types (KnowledgeTextBlockInput, ExtractedTaskCandidate, TaskCandidateSource)
 * now live in domain/value-objects/TaskCandidate.ts. They are re-exported here so existing
 * application-layer import paths continue to resolve.
 *
 * @see ADR-5201 Accidental Complexity — workspace flow application structure
 */

import type {
  KnowledgeTextBlockInput,
  ExtractedTaskCandidate,
} from "../../../task/domain/value-objects/TaskCandidate";

export type {
  KnowledgeTextBlockInput,
  TaskCandidateSource,
  ExtractedTaskCandidate,
} from "../../../task/domain/value-objects/TaskCandidate";

export interface ExtractTaskCandidatesFromKnowledgeDto {
  readonly knowledgePageId: string;
  readonly blocks: ReadonlyArray<KnowledgeTextBlockInput>;
  readonly enableAiFallback?: boolean;
}

export interface ExtractTaskCandidatesFromKnowledgeResult {
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly usedAiFallback: boolean;
}

