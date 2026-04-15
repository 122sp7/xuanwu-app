/**
 * Simple task extraction domain port — framework-free contract used by
 * lightweight task extraction adapters (e.g. workspace-workflow path).
 *
 * For the full task extraction contract with prompt context and model routing,
 * see DistillationPort.ts (TaskExtractionPort / TaskExtractionInput).
 *
 * This layer is intentionally framework-agnostic. No Genkit, Firebase, or
 * HTTP client imports are permitted here.
 */

export interface ExtractedTaskItem {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}

export interface TaskExtractionInput {
  readonly content: string;
  readonly maxCandidates?: number;
}

export interface TaskExtractionOutput {
  readonly tasks: ReadonlyArray<ExtractedTaskItem>;
}

export interface TaskExtractionPort {
  extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}
