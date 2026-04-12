/**
 * @module workspace-flow/application/dto
 * @file extract-task-candidates-from-knowledge.dto.ts
 * @description DTOs for extracting task candidates from knowledge content.
 */

export interface KnowledgeTextBlockInput {
  readonly blockId: string;
  readonly text: string;
  readonly pageIndex?: number;
}

export type TaskCandidateSource = "rule" | "ai";

export interface ExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly source: TaskCandidateSource;
  readonly confidence: number;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}

export interface ExtractTaskCandidatesFromKnowledgeDto {
  readonly knowledgePageId: string;
  readonly blocks: ReadonlyArray<KnowledgeTextBlockInput>;
  readonly enableAiFallback?: boolean;
}

export interface ExtractTaskCandidatesFromKnowledgeResult {
  readonly candidates: ReadonlyArray<ExtractedTaskCandidate>;
  readonly usedAiFallback: boolean;
}
