import type { ExtractedTaskCandidate, TaskCandidateSource } from "../value-objects/TaskCandidate";

export interface ExtractTaskCandidatesInput {
  readonly workspaceId: string;
  readonly sourceType: TaskCandidateSource;
  readonly sourcePageIds: string[];
  readonly sourceText?: string;
}

/**
 * TaskCandidateExtractorPort — outbound port for AI-driven task candidate extraction.
 *
 * Implementations live in adapters/outbound/genkit/ (Genkit flow) or
 * adapters/outbound/callable/ (Firebase callable to py_fn).
 * Use cases depend only on this interface; they never import concrete adapters.
 */
export interface TaskCandidateExtractorPort {
  extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]>;
}
