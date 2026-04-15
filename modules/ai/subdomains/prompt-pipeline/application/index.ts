import type {
  ComplianceExtractionPromptInput,
  ComplianceExtractionPromptIntent,
  KnowledgeSynthesisPromptInput,
  KnowledgeSynthesisPromptIntent,
  ProcurementExtractionPromptInput,
  ProcurementExtractionPromptIntent,
  PromptExecutionMode,
  PromptRegistryPort,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  PromptTemplateKey,
  RagPreparationPromptInput,
  RagPreparationPromptIntent,
  ResolvedPrompt,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";

const PROMPT_VERSION = "v1";

// ── Shared definition type ────────────────────────────────────────────────────

type PromptTemplateDefinition<TIntent extends PromptTemplateKey, TInput> = {
  readonly family: PromptTemplateFamily;
  readonly templateKey: TIntent;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
  readonly system: string;
  /** Tool names from tool-runtime that this prompt benefits from. */
  readonly recommendedTools: readonly string[];
  readonly promptBuilder: (input: TInput, mode: PromptExecutionMode) => string;
};

// ── Shared helpers ────────────────────────────────────────────────────────────

function toDescriptor<TIntent extends PromptTemplateKey, TInput>(
  template: PromptTemplateDefinition<TIntent, TInput>,
  mode: PromptExecutionMode,
): PromptTemplateDescriptor {
  return {
    family: template.family,
    templateKey: template.templateKey,
    intent: template.templateKey,
    mode,
    label: template.label,
    summary: template.summary,
    outcome: template.outcome,
    version: template.version,
    scenario: template.scenario,
  };
}

function toResolvedPrompt<TIntent extends PromptTemplateKey, TInput>(
  template: PromptTemplateDefinition<TIntent, TInput>,
  input: TInput,
  mode: PromptExecutionMode,
): ResolvedPrompt {
  return {
    family: template.family,
    templateKey: template.templateKey,
    intent: template.templateKey,
    mode,
    label: template.label,
    summary: template.summary,
    outcome: template.outcome,
    version: template.version,
    scenario: template.scenario,
    system: template.system,
    prompt: template.promptBuilder(input, mode),
    recommendedTools: template.recommendedTools,
  };
}

// ── Family: task-extraction ───────────────────────────────────────────────────

const TASK_EXTRACTION_PROMPTS: Record<
  TaskExtractionPromptIntent,
  PromptTemplateDefinition<TaskExtractionPromptIntent, TaskExtractionPromptInput>
> = {
  "document-task-candidates": {
    family: "task-extraction",
    templateKey: "document-task-candidates",
    label: "任務候選萃取",
    summary: "從 parsed JSON / 文字內容中提取可確認的任務候選，供使用者預覽與勾選。",
    outcome: "回傳可執行的 task candidate 清單，而不是直接 materialize。",
    version: PROMPT_VERSION,
    scenario: "candidate-review",
    system: "You are a task distillation assistant. Extract only concrete and evidence-backed task candidates from the provided document content.",
    recommendedTools: [],
    promptBuilder: (input, mode) => [
      `請從 ${input.filename} 的內容中萃取任務候選。`,
      `模式：${mode === "workflow" ? "多步驟引導" : mode === "preview" ? "候選確認預覽" : "單一步驟"}`,
      `jsonReady=${input.jsonReady ? "true" : "false"}, maxCandidates=${input.maxCandidates ?? 20}`,
      "只保留具體、可執行、可追溯的事項；跳過摘要、背景描述與純資訊句。",
      "如果有日期、截止日或 owner 線索，請盡量保留在結構化結果中。",
      input.contentPreview?.trim() ? `內容摘要：\n${input.contentPreview.trim()}` : "內容摘要：尚未提供。",
    ].join("\n"),
  },
};

// ── Family: procurement-extraction ───────────────────────────────────────────

const PROCUREMENT_EXTRACTION_PROMPTS: Record<
  ProcurementExtractionPromptIntent,
  PromptTemplateDefinition<ProcurementExtractionPromptIntent, ProcurementExtractionPromptInput>
> = {
  "procurement-line-items": {
    family: "procurement-extraction",
    templateKey: "procurement-line-items",
    label: "採購項次萃取",
    summary: "從採購單或報價單中萃取每一個可計費項次，保留數量、金額與工程分類。",
    outcome: "回傳結構化項次清單；每筆都含 itemNumber, workCategory, title, quantity, unit, estimatedAmount, dueDate。",
    version: PROMPT_VERSION,
    scenario: "procurement-review",
    system: [
      "You are a procurement document analysis assistant.",
      "Extract every line item from the provided purchase order or quotation.",
      "For each line item return: itemNumber, workCategory (the section heading, e.g. 'SCADA站內工程'), title (scope description), quantity, unit, estimatedAmount (after discount), and dueDate (ISO 8601 if present).",
      "If estimatedAmount can be verified by evaluating unitPrice × quantity − discount, call the evaluateMathExpression tool to confirm the figure.",
      "If a delivery date is present, call getCurrentDatetime to determine whether it is in the future or already past.",
      "Preserve the original document locale. Do not translate field values.",
    ].join(" "),
    recommendedTools: ["ai.evaluateMathExpression", "ai.getCurrentDatetime"],
    promptBuilder: (input, mode) => [
      `文件：${input.filename}`,
      `語系：${input.documentLocale ?? "zh-TW"}，幣別：${input.currency ?? "TWD"}`,
      `模式：${mode === "workflow" ? "多步驟引導" : mode === "preview" ? "項次確認預覽" : "單一步驟"}`,
      `maxLineItems=${input.maxLineItems ?? 50}`,
      "請逐項萃取每一個可計費項次。",
      "每筆必須包含：項次編號、工程分類、工作說明、數量、單位、折後小計、交貨日期。",
      "若小計可由「單價 × 數量 − 折扣」驗算，請呼叫 evaluateMathExpression 工具確認金額。",
      "若存在交貨日期，請呼叫 getCurrentDatetime 工具判斷該日期是否已逾期。",
      input.contentPreview?.trim() ? `內容摘要：\n${input.contentPreview.trim()}` : "",
    ].filter(Boolean).join("\n"),
  },

  "compliance-obligations": {
    family: "procurement-extraction",
    templateKey: "compliance-obligations",
    label: "採購合規義務萃取",
    summary: "從採購條款、安全衛生附件中萃取明確的義務性要求與截止日。",
    outcome: "回傳合規任務清單；每筆含 obligation, deadline (if any), evidenceRequired, penaltyClause (if any)。",
    version: PROMPT_VERSION,
    scenario: "compliance-review",
    system: [
      "You are a procurement compliance analyst.",
      "Extract every binding obligation, deadline, and penalty clause from the provided procurement terms and safety requirements.",
      "For each obligation state: the obligation text, the responsible party, the deadline (ISO 8601 if deterministic), required evidence, and the penalty clause if one exists.",
      "If a relative deadline is expressed (e.g. 'within 3 business days'), call getCurrentDatetime to anchor it to an absolute date.",
    ].join(" "),
    recommendedTools: ["ai.getCurrentDatetime"],
    promptBuilder: (input, _mode) => [
      `文件：${input.filename}`,
      "請從採購條款與安全衛生規定中，萃取所有具約束力的義務事項。",
      "每筆義務須包含：義務說明、責任方、截止期限（若有相對日期請換算為絕對日期）、要求的驗收文件、違反時的罰則。",
      "跳過純背景說明與無義務性句子。",
      input.contentPreview?.trim() ? `內容摘要：\n${input.contentPreview.trim()}` : "",
    ].filter(Boolean).join("\n"),
  },
};

// ── Family: knowledge-synthesis ──────────────────────────────────────────────

const KNOWLEDGE_SYNTHESIS_PROMPTS: Record<
  KnowledgeSynthesisPromptIntent,
  PromptTemplateDefinition<KnowledgeSynthesisPromptIntent, KnowledgeSynthesisPromptInput>
> = {
  "knowledge-page-draft": {
    family: "knowledge-synthesis",
    templateKey: "knowledge-page-draft",
    label: "Knowledge Page 草稿生成",
    summary: "將文件內容提煉成可直接用於 Knowledge Page 的摘要與重點清單。",
    outcome: "回傳 overview + distilledItems (title + summary)，可直接映射到 KnowledgeArtifact 草稿。",
    version: PROMPT_VERSION,
    scenario: "knowledge-draft",
    system: "You are a knowledge management assistant. Synthesize the provided document into a structured knowledge page draft with a concise overview and a list of key knowledge points. Each point should be reusable, self-contained, and traceable to the source.",
    recommendedTools: [],
    promptBuilder: (input, _mode) => [
      `文件：${input.filename}`,
      input.objectiveSummary ? `主題目標：${input.objectiveSummary}` : "",
      input.targetAudience ? `目標受眾：${input.targetAudience}` : "",
      "請生成一個 Knowledge Page 草稿，包含：",
      "1. overview — 100 字以內的全文摘要",
      "2. distilledItems — 5 至 10 個可重用知識點，每點含 title 與 summary",
      "知識點必須來自原文，不要加入原文未有的推論。",
      input.contentPreview?.trim() ? `內容摘要：\n${input.contentPreview.trim()}` : "",
    ].filter(Boolean).join("\n"),
  },
};

// ── Family: rag-preparation ───────────────────────────────────────────────────

const RAG_PREPARATION_PROMPTS: Record<
  RagPreparationPromptIntent,
  PromptTemplateDefinition<RagPreparationPromptIntent, RagPreparationPromptInput>
> = {
  "rag-chunk-annotation": {
    family: "rag-preparation",
    templateKey: "rag-chunk-annotation",
    label: "RAG Chunk 標註",
    summary: "為文件 chunk 加上語意標籤，提升向量搜尋的召回精度。",
    outcome: "回傳每個 chunk 的 chunkText, section, pageRef, docType, semanticTags。",
    version: PROMPT_VERSION,
    scenario: "rag-indexing",
    system: "You are a retrieval-augmented generation preparation assistant. Annotate each provided document chunk with its section heading, page reference, document type, and a short list of semantic tags that improve retrieval recall. Do not paraphrase the chunk content.",
    recommendedTools: [],
    promptBuilder: (input, _mode) => [
      `文件：${input.filename}`,
      `文件類型：${input.docType ?? "未指定"}`,
      `分塊策略：${input.chunkStrategy ?? "paragraph"}`,
      "請對每個 chunk 加上標註：",
      "- section：所屬章節標題",
      "- pageRef：頁碼或位置參考",
      "- docType：文件類型（例如 procurement / contract / technical-spec）",
      "- semanticTags：2 至 5 個提升召回率的語意標籤",
      "不要修改 chunk 的原始文字。",
      input.contentPreview?.trim() ? `內容摘要：\n${input.contentPreview.trim()}` : "",
    ].filter(Boolean).join("\n"),
  },
};

// ── Family: compliance-extraction ────────────────────────────────────────────

const COMPLIANCE_EXTRACTION_PROMPTS: Record<
  ComplianceExtractionPromptIntent,
  PromptTemplateDefinition<ComplianceExtractionPromptIntent, ComplianceExtractionPromptInput>
> = {
  "contract-obligations": {
    family: "compliance-extraction",
    templateKey: "contract-obligations",
    label: "合約義務萃取",
    summary: "從法律合約或服務協議中萃取條款義務、截止日與違約後果。",
    outcome: "回傳義務清單；每筆含 obligation, responsibleParty, deadline, evidenceRequired, penaltyClause。",
    version: PROMPT_VERSION,
    scenario: "contract-review",
    system: [
      "You are a legal contract analysis assistant.",
      "Extract every binding obligation from the provided contract.",
      "For each obligation state: the obligation text, the responsible party, the deadline (ISO 8601 if deterministic), what evidence of performance is required, and the consequence or penalty if not fulfilled.",
      "If a deadline is expressed relatively (e.g. 'within 30 days of signing'), call getCurrentDatetime to anchor it.",
    ].join(" "),
    recommendedTools: ["ai.getCurrentDatetime"],
    promptBuilder: (input, _mode) => [
      `文件：${input.filename}`,
      input.jurisdiction ? `司法管轄：${input.jurisdiction}` : "",
      input.contractType ? `合約類型：${input.contractType}` : "",
      input.parties?.length ? `當事方：${input.parties.join("、")}` : "",
      "請從合約文件中萃取所有具約束力的義務條款。",
      "每筆義務須包含：條款說明、責任方、截止期限、要求的履約證明、違約後果。",
      "若存在相對日期（如「簽約後30日內」），請呼叫 getCurrentDatetime 工具計算絕對日期。",
      input.contentPreview?.trim() ? `內容摘要：\n${input.contentPreview.trim()}` : "",
    ].filter(Boolean).join("\n"),
  },
};

// ── Registry service ──────────────────────────────────────────────────────────

class PromptRegistryService implements PromptRegistryPort {
  listPromptFamilies(): ReadonlyArray<PromptTemplateFamily> {
    return [
      "task-extraction",
      "procurement-extraction",
      "knowledge-synthesis",
      "rag-preparation",
      "compliance-extraction",
    ];
  }

  // task-extraction
  listTaskExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(TASK_EXTRACTION_PROMPTS) as Array<
      PromptTemplateDefinition<TaskExtractionPromptIntent, TaskExtractionPromptInput>
    >).map((t) => toDescriptor(t, mode));
  }
  resolveTaskExtractionPrompt(intent: TaskExtractionPromptIntent, input: TaskExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
    return toResolvedPrompt(TASK_EXTRACTION_PROMPTS[intent], input, mode);
  }

  // procurement-extraction
  listProcurementExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(PROCUREMENT_EXTRACTION_PROMPTS) as Array<
      PromptTemplateDefinition<ProcurementExtractionPromptIntent, ProcurementExtractionPromptInput>
    >).map((t) => toDescriptor(t, mode));
  }
  resolveProcurementExtractionPrompt(intent: ProcurementExtractionPromptIntent, input: ProcurementExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
    return toResolvedPrompt(PROCUREMENT_EXTRACTION_PROMPTS[intent], input, mode);
  }

  // knowledge-synthesis
  listKnowledgeSynthesisPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(KNOWLEDGE_SYNTHESIS_PROMPTS) as Array<
      PromptTemplateDefinition<KnowledgeSynthesisPromptIntent, KnowledgeSynthesisPromptInput>
    >).map((t) => toDescriptor(t, mode));
  }
  resolveKnowledgeSynthesisPrompt(intent: KnowledgeSynthesisPromptIntent, input: KnowledgeSynthesisPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
    return toResolvedPrompt(KNOWLEDGE_SYNTHESIS_PROMPTS[intent], input, mode);
  }

  // rag-preparation
  listRagPreparationPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(RAG_PREPARATION_PROMPTS) as Array<
      PromptTemplateDefinition<RagPreparationPromptIntent, RagPreparationPromptInput>
    >).map((t) => toDescriptor(t, mode));
  }
  resolveRagPreparationPrompt(intent: RagPreparationPromptIntent, input: RagPreparationPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
    return toResolvedPrompt(RAG_PREPARATION_PROMPTS[intent], input, mode);
  }

  // compliance-extraction
  listComplianceExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(COMPLIANCE_EXTRACTION_PROMPTS) as Array<
      PromptTemplateDefinition<ComplianceExtractionPromptIntent, ComplianceExtractionPromptInput>
    >).map((t) => toDescriptor(t, mode));
  }
  resolveComplianceExtractionPrompt(intent: ComplianceExtractionPromptIntent, input: ComplianceExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
    return toResolvedPrompt(COMPLIANCE_EXTRACTION_PROMPTS[intent], input, mode);
  }
}

export const promptRegistryService = new PromptRegistryService();

// ── Public free functions ─────────────────────────────────────────────────────

export function listPromptFamilies(): ReadonlyArray<PromptTemplateFamily> {
  return promptRegistryService.listPromptFamilies();
}

export function listTaskExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
  return promptRegistryService.listTaskExtractionPrompts(mode);
}
export function resolveTaskExtractionPrompt(intent: TaskExtractionPromptIntent, input: TaskExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
  return promptRegistryService.resolveTaskExtractionPrompt(intent, input, mode);
}

export function listProcurementExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
  return promptRegistryService.listProcurementExtractionPrompts(mode);
}
export function resolveProcurementExtractionPrompt(intent: ProcurementExtractionPromptIntent, input: ProcurementExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
  return promptRegistryService.resolveProcurementExtractionPrompt(intent, input, mode);
}

export function listKnowledgeSynthesisPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
  return promptRegistryService.listKnowledgeSynthesisPrompts(mode);
}
export function resolveKnowledgeSynthesisPrompt(intent: KnowledgeSynthesisPromptIntent, input: KnowledgeSynthesisPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
  return promptRegistryService.resolveKnowledgeSynthesisPrompt(intent, input, mode);
}

export function listRagPreparationPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
  return promptRegistryService.listRagPreparationPrompts(mode);
}
export function resolveRagPreparationPrompt(intent: RagPreparationPromptIntent, input: RagPreparationPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
  return promptRegistryService.resolveRagPreparationPrompt(intent, input, mode);
}

export function listComplianceExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
  return promptRegistryService.listComplianceExtractionPrompts(mode);
}
export function resolveComplianceExtractionPrompt(intent: ComplianceExtractionPromptIntent, input: ComplianceExtractionPromptInput, mode: PromptExecutionMode = "preview"): ResolvedPrompt {
  return promptRegistryService.resolveComplianceExtractionPrompt(intent, input, mode);
}
