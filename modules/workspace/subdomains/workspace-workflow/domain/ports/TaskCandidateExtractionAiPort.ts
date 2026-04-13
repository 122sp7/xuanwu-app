/**
 * @module workspace-flow/domain/ports
 * @file TaskCandidateExtractionAiPort.ts
 * @description Driven port interface for AI task candidate extraction.
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
