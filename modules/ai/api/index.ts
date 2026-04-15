/**
 * Public API boundary for the AI bounded context.
 *
 * Cross-module consumers must import shared AI contracts through this entry point.
 * Server-only helpers live in ./server.ts.
 */

export type {
  AIAPI,
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "../subdomains/content-generation/api";
export type {
  DistillationAPI,
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
} from "../subdomains/content-distillation/api";

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

export type {
  ToolDescriptor,
  ToolEnabledGenerationInput,
  ToolEnabledGenerationOutput,
  ToolRuntimeAPI,
  ToolRuntimePort,
} from "../subdomains/tool-runtime/api";
