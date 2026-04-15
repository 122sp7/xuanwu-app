/**
 * AI prompt-pipeline subdomain — domain contracts.
 *
 * Each PromptTemplateFamily maps to a distinct document class with its own
 * input schema, output schema, and optional tool requirements.
 */

// ── Families ─────────────────────────────────────────────────────────────────

export type PromptTemplateFamily =
  | "task-extraction"
  | "procurement-extraction"
  | "knowledge-synthesis"
  | "rag-preparation"
  | "compliance-extraction";

// ── Execution mode ────────────────────────────────────────────────────────────

export type PromptExecutionMode = "manual" | "workflow" | "preview";

// ── Intent keys per family ────────────────────────────────────────────────────

export type TaskExtractionPromptIntent = "document-task-candidates";
export type ProcurementExtractionPromptIntent =
  | "procurement-line-items"
  | "compliance-obligations";
export type KnowledgeSynthesisPromptIntent = "knowledge-page-draft";
export type RagPreparationPromptIntent = "rag-chunk-annotation";
export type ComplianceExtractionPromptIntent = "contract-obligations";

export type PromptTemplateKey =
  | TaskExtractionPromptIntent
  | ProcurementExtractionPromptIntent
  | KnowledgeSynthesisPromptIntent
  | RagPreparationPromptIntent
  | ComplianceExtractionPromptIntent;

// ── Prompt input types (one per family) ──────────────────────────────────────

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

/** Input descriptor for structured procurement / purchase-order documents. */
export interface ProcurementExtractionPromptInput {
  readonly filename: string;
  readonly mimeType?: string;
  /** ISO 4217 currency code, e.g. "TWD". */
  readonly currency?: string;
  /** BCP 47 locale of the document source, e.g. "zh-TW". */
  readonly documentLocale?: string;
  readonly pageCount?: number;
  readonly maxLineItems?: number;
  readonly contentPreview?: string;
}

/** Input descriptor for producing a Knowledge Page draft from reference material. */
export interface KnowledgeSynthesisPromptInput {
  readonly filename: string;
  readonly objectiveSummary?: string;
  readonly targetAudience?: string;
  readonly pageCount?: number;
  readonly contentPreview?: string;
}

/** Input descriptor for annotating document chunks for RAG indexing. */
export interface RagPreparationPromptInput {
  readonly filename: string;
  /**
   * Broad document type hint, e.g. "procurement", "technical-spec", "contract".
   * Used to choose annotation depth; does not gate which prompt is selected.
   */
  readonly docType?: string;
  readonly chunkStrategy?: "sentence" | "paragraph" | "section";
  readonly pageCount?: number;
  readonly contentPreview?: string;
}

/** Input descriptor for extracting legal / contractual obligations. */
export interface ComplianceExtractionPromptInput {
  readonly filename: string;
  /** ISO 3166-1 alpha-2 jurisdiction code, e.g. "TW", "US". */
  readonly jurisdiction?: string;
  readonly contractType?: string;
  readonly parties?: readonly string[];
  readonly pageCount?: number;
  readonly contentPreview?: string;
}

// ── Shared descriptors ────────────────────────────────────────────────────────

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
  /**
   * Tool names this prompt recommends activating during generation.
   * Names match the `ToolDescriptor.name` values registered in tool-runtime.
   * An empty array means no tools are needed.
   */
  readonly recommendedTools: readonly string[];
}

// ── Registry port ─────────────────────────────────────────────────────────────

export interface PromptRegistryPort {
  listPromptFamilies(): ReadonlyArray<PromptTemplateFamily>;

  listTaskExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveTaskExtractionPrompt(
    intent: TaskExtractionPromptIntent,
    input: TaskExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listProcurementExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveProcurementExtractionPrompt(
    intent: ProcurementExtractionPromptIntent,
    input: ProcurementExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listKnowledgeSynthesisPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveKnowledgeSynthesisPrompt(
    intent: KnowledgeSynthesisPromptIntent,
    input: KnowledgeSynthesisPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listRagPreparationPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveRagPreparationPrompt(
    intent: RagPreparationPromptIntent,
    input: RagPreparationPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;

  listComplianceExtractionPrompts(mode?: PromptExecutionMode): ReadonlyArray<PromptTemplateDescriptor>;
  resolveComplianceExtractionPrompt(
    intent: ComplianceExtractionPromptIntent,
    input: ComplianceExtractionPromptInput,
    mode?: PromptExecutionMode,
  ): ResolvedPrompt;
}
