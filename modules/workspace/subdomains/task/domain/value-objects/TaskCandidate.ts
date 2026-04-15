/**
 * @module workspace-flow/domain/value-objects
 * @file TaskCandidate.ts
 * @description Domain value types for extracted task candidates from knowledge content.
 *
 * Moved from application/dto to domain so the stateless rule engine
 * (TaskCandidateRuleExtractor) can live in domain/services/ without
 * depending on the application layer.
 *
 * @see ADR-5201 Accidental Complexity — workspace-workflow application structure
 */

export type TaskCandidateSource = "rule" | "ai";

export interface KnowledgeTextBlockInput {
  readonly blockId: string;
  readonly text: string;
  readonly pageIndex?: number;
}

export interface ExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly source: TaskCandidateSource;
  readonly confidence: number;
  readonly sourceBlockId?: string;
  readonly sourceSnippet?: string;
}
