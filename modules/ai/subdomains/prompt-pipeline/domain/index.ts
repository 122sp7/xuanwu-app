/**
 * AI prompt-pipeline subdomain — domain contracts.
 *
 * This layer stays framework-free and defines the semantic prompt registry
 * used by downstream modules such as workspace and notebooklm.
 */

export type SourceFollowUpPromptIntent =
  | "source-ocr"
  | "source-rag-index"
  | "source-knowledge-page"
  | "source-task-materialization";

export type PromptExecutionMode = "manual" | "workflow";

export interface SourceFollowUpPromptInput {
  readonly filename: string;
  readonly mimeType?: string;
  readonly workspaceId?: string;
  readonly accountId?: string;
  readonly jsonReady?: boolean;
  readonly pageCount?: number;
}

export interface PromptTemplateDescriptor {
  readonly intent: SourceFollowUpPromptIntent;
  readonly mode: PromptExecutionMode;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
}

export interface ResolvedPrompt {
  readonly intent: SourceFollowUpPromptIntent;
  readonly mode: PromptExecutionMode;
  readonly label: string;
  readonly summary: string;
  readonly system: string;
  readonly prompt: string;
}

export interface PromptRegistryPort {
  listSourceFollowUpPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveSourceFollowUpPrompt(
    intent: SourceFollowUpPromptIntent,
    input: SourceFollowUpPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
}
