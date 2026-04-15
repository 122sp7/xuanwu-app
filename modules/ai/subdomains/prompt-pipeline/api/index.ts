/**
 * AI prompt-pipeline subdomain public API.
 *
 * Semantic prompt-registry boundary only.
 * No provider SDKs, UI exports, or infrastructure leakage.
 */

export type {
  ComplianceExtractionPromptInput,
  ComplianceExtractionPromptIntent,
  KnowledgeSynthesisPromptInput,
  KnowledgeSynthesisPromptIntent,
  ProcurementExtractionPromptInput,
  ProcurementExtractionPromptIntent,
  PromptExecutionMode,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  RagPreparationPromptInput,
  RagPreparationPromptIntent,
  ResolvedPrompt,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";

export {
  listComplianceExtractionPrompts,
  listKnowledgeSynthesisPrompts,
  listProcurementExtractionPrompts,
  listPromptFamilies,
  listRagPreparationPrompts,
  listTaskExtractionPrompts,
  promptRegistryService,
  resolveComplianceExtractionPrompt,
  resolveKnowledgeSynthesisPrompt,
  resolveProcurementExtractionPrompt,
  resolveRagPreparationPrompt,
  resolveTaskExtractionPrompt,
} from "../application";
