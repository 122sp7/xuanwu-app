/**
 * AI prompt-pipeline subdomain public API.
 *
 * Semantic prompt-registry boundary only.
 * No provider SDKs, UI exports, or infrastructure leakage.
 */

export type {
  PromptExecutionMode,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  ResolvedPrompt,
  SourceFollowUpPromptInput,
  SourceFollowUpPromptIntent,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";

export {
  listPromptFamilies,
  listSourceFollowUpPrompts,
  listTaskExtractionPrompts,
  resolveSourceFollowUpPrompt,
  resolveTaskExtractionPrompt,
  promptRegistryService,
  sourceFollowUpPromptService,
} from "../application";
