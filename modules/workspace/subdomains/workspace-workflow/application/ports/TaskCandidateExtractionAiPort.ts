/**
 * @module workspace-flow/application/ports
 * @file TaskCandidateExtractionAiPort.ts
 * @description AI fallback contract for extracting task candidates.
 */

export interface AIExtractedTaskCandidate {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
  readonly confidence?: number;
  readonly sourceSnippet?: string;
}

export interface TaskCandidateExtractionAiPort {
  extractTaskCandidates(input: {
    readonly knowledgePageId: string;
    readonly content: string;
    readonly maxCandidates?: number;
  }): Promise<ReadonlyArray<AIExtractedTaskCandidate>>;
}
