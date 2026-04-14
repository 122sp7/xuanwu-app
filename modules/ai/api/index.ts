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
} from "../subdomains/generation/api";
export type {
  DistillationAPI,
  DistillContentInput,
  DistillationItem,
  DistillationPort,
  DistillationResult,
  DistillationSource,
} from "../subdomains/distillation/api";

export type {
  PromptExecutionMode,
  PromptTemplateDescriptor,
  ResolvedPrompt,
  SourceFollowUpPromptInput,
  SourceFollowUpPromptIntent,
} from "../subdomains/prompt-pipeline/api";

export {
  listSourceFollowUpPrompts,
  resolveSourceFollowUpPrompt,
  sourceFollowUpPromptService,
} from "../subdomains/prompt-pipeline/api";
