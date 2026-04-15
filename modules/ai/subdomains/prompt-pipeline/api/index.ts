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
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";

export {
  listPromptFamilies,
  listTaskExtractionPrompts,
  resolveTaskExtractionPrompt,
  promptRegistryService,
} from "../application";
