/**
 * AI prompt-pipeline subdomain — domain contracts.
 *
 * This layer stays framework-free and defines the semantic prompt registry
 * used by downstream modules such as workspace and notebooklm.
 *
 * One prompt-pipeline capability may host multiple prompt families and
 * multiple templates per family without changing bounded-context ownership.
 */

export type PromptTemplateFamily = "source-follow-up" | "task-extraction";

export type SourceFollowUpPromptIntent =
  | "source-ocr"
  | "source-rag-index"
  | "source-knowledge-page"
  | "source-task-materialization";

export type TaskExtractionPromptIntent = "document-task-candidates";

export type PromptTemplateKey = SourceFollowUpPromptIntent | TaskExtractionPromptIntent;

export type PromptExecutionMode = "manual" | "workflow" | "preview";

export interface SourceFollowUpPromptInput {
  readonly filename: string;
  readonly mimeType?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly jsonReady?: boolean;
  readonly pageCount?: number;
}

export interface TaskExtractionPromptInput extends SourceFollowUpPromptInput {
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
  listSourceFollowUpPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveSourceFollowUpPrompt(
    intent: SourceFollowUpPromptIntent,
    input: SourceFollowUpPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
  listTaskExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveTaskExtractionPrompt(
    intent: TaskExtractionPromptIntent,
    input: TaskExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
}
