/**
 * AI prompt-pipeline subdomain — domain contracts.
 *
 * Keep only real runtime prompt families here. OCR and RAG indexing are
 * pipeline operations, not Genkit prompt variants.
 */

export type PromptTemplateFamily = "task-extraction";
export type TaskExtractionPromptIntent = "document-task-candidates";
export type PromptTemplateKey = TaskExtractionPromptIntent;
export type PromptExecutionMode = "manual" | "workflow" | "preview";

export interface TaskExtractionPromptInput {
  readonly filename: string;
  readonly mimeType?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly jsonReady?: boolean;
  readonly pageCount?: number;
  readonly contentPreview?: string;
  readonly maxCandidates?: number;
}

export interface PromptTemplateDescriptor {
  readonly family: PromptTemplateFamily;
  readonly templateKey: PromptTemplateKey;
  readonly intent: PromptTemplateKey;
  readonly mode: PromptExecutionMode;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
}

export interface ResolvedPrompt {
  readonly family: PromptTemplateFamily;
  readonly templateKey: PromptTemplateKey;
  readonly intent: PromptTemplateKey;
  readonly mode: PromptExecutionMode;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
  readonly system: string;
  readonly prompt: string;
}

export interface PromptRegistryPort {
  listPromptFamilies(): ReadonlyArray<PromptTemplateFamily>;
  listTaskExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveTaskExtractionPrompt(
    intent: TaskExtractionPromptIntent,
    input: TaskExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
}
