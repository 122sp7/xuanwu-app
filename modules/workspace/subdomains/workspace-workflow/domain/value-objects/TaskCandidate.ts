/**
 * @module workspace-flow/domain/value-objects
 * @file TaskCandidate.ts
 * @description Domain value types for extracted task candidates from knowledge content.
 *
 * These remain in the domain layer so workspace-workflow can normalize and
 * materialize AI-proposed task candidates without depending on application DTOs.
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
