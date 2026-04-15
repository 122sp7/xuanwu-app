export interface DistillationSource {
  readonly title?: string | null;
  readonly text: string;
}

export interface DistillContentInput {
  readonly sources: readonly DistillationSource[];
  readonly objective?: string;
  readonly model?: string;
}

export interface DistillationItem {
  readonly title: string;
  readonly summary: string;
  readonly sourceTitle?: string | null;
}

export interface DistillationResult {
  readonly overview: string;
  readonly distilledItems: readonly DistillationItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}

export interface ExtractedTaskItem {
  readonly title: string;
  readonly description?: string;
  readonly dueDate?: string;
}

export interface TaskExtractionPromptContext {
  readonly filename?: string;
  readonly mimeType?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly jsonReady?: boolean;
  readonly pageCount?: number;
  readonly sourceGcsUri?: string;
  readonly jsonGcsUri?: string;
}

export interface TaskExtractionInput {
  readonly content: string;
  readonly maxCandidates?: number;
  readonly model?: string;
  readonly promptContext?: TaskExtractionPromptContext;
}

export interface TaskExtractionOutput {
  readonly tasks: readonly ExtractedTaskItem[];
  readonly model: string;
  readonly traceId: string;
  readonly completedAt: string;
}

export interface TaskExtractionPort {
  extractTasks(input: TaskExtractionInput): Promise<TaskExtractionOutput>;
}

export interface DistillationPort extends TaskExtractionPort {
  distill(input: DistillContentInput): Promise<DistillationResult>;
}
