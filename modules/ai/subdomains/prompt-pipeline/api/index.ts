/**
 * AI prompt-pipeline subdomain public API.
 *
 * Semantic prompt-registry boundary only.
 * No provider SDKs, UI exports, or infrastructure leakage.
 */

export type {
  PromptExecutionMode,
  PromptTemplateDescriptor,
  ResolvedPrompt,
  SourceFollowUpPromptInput,
  SourceFollowUpPromptIntent,
} from "../domain";

export {
  listSourceFollowUpPrompts,
  resolveSourceFollowUpPrompt,
  sourceFollowUpPromptService,
} from "../application";
