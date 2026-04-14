/**
 * @module ai/subdomains/tool-runtime
 * @file domain/ports/TaskExtractionPort.ts
 * @description Domain port for AI-powered task extraction from content.
 * Framework-agnostic. No Genkit, Firebase, or HTTP client imports permitted here.
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
