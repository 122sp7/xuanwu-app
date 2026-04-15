/**
 * Public API boundary for the AI bounded context.
 *
 * Cross-module consumers must import shared AI contracts through this entry point.
 * Server-only helpers live in ./server.ts.
 */

export type {
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "../domain/ports/AiTextGenerationPort";

export type {
  DistillContentInput,
  DistillationItem,
  DistillationPort,
  DistillationResult,
  DistillationSource,
  ExtractedTaskItem,
  TaskExtractionInput,
  TaskExtractionOutput,
  TaskExtractionPort,
  TaskExtractionPromptContext,
} from "../domain/ports/DistillationPort";

export type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimePort,
} from "../domain/ports/ToolRuntimePort";

// ── Cross-module capability contracts ─────────────────────────────────────────
// These interfaces let downstream modules (workspace, notebooklm) receive an
// opaque capability bag without importing concrete adapters.

export interface AIAPI {
  summarize(text: string, model?: string): Promise<string>;
  generateText(
    input: import("../domain/ports/AiTextGenerationPort").GenerateAiTextInput,
  ): Promise<import("../domain/ports/AiTextGenerationPort").GenerateAiTextOutput>;
}

export interface DistillationAPI {
  distillContent(
    input: import("../domain/ports/DistillationPort").DistillContentInput,
  ): Promise<import("../domain/ports/DistillationPort").DistillationResult>;
  extractTasksFromContent(
    input: import("../domain/ports/DistillationPort").TaskExtractionInput,
  ): Promise<import("../domain/ports/DistillationPort").TaskExtractionOutput>;
}

export interface ToolRuntimeAPI {
  generateWithTools(
    input: import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationInput,
  ): Promise<import("../domain/ports/ToolRuntimePort").ToolEnabledGenerationOutput>;
  listAvailableTools(): ReadonlyArray<
    import("../domain/ports/ToolRuntimePort").ToolDescriptor
  >;
}

// ── prompt-pipeline — noun subdomain, kept as-is ─────────────────────────────

export type {
  PromptExecutionMode,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  ResolvedPrompt,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../subdomains/prompt-pipeline/api";

export {
  listPromptFamilies,
  listTaskExtractionPrompts,
  resolveTaskExtractionPrompt,
  promptRegistryService,
} from "../subdomains/prompt-pipeline/api";

