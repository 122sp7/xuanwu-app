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
    readonly sourceContext?: {
      readonly filename?: string;
      readonly mimeType?: string;
      readonly pageCount?: number;
      readonly sourceGcsUri?: string;
      readonly jsonGcsUri?: string;
    };
  }): Promise<ReadonlyArray<AIExtractedTaskCandidate>>;
}
