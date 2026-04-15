import type {
  PromptExecutionMode,
  PromptRegistryPort,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  PromptTemplateKey,
  ResolvedPrompt,
  SourceFollowUpPromptInput,
  SourceFollowUpPromptIntent,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";

const SOURCE_FOLLOW_UP_FAMILY: PromptTemplateFamily = "source-follow-up";
const TASK_EXTRACTION_FAMILY: PromptTemplateFamily = "task-extraction";
const PROMPT_VERSION = "v1";

type PromptTemplateDefinition<TIntent extends PromptTemplateKey, TInput> = {
  readonly family: PromptTemplateFamily;
  readonly templateKey: TIntent;
  readonly label: string;
  readonly summary: string;
  readonly outcome: string;
  readonly version: string;
  readonly scenario: string;
  readonly system: string;
  readonly promptBuilder: (input: TInput, mode: PromptExecutionMode) => string;
};

const SOURCE_FOLLOW_UP_PROMPTS: Record<
  SourceFollowUpPromptIntent,
  PromptTemplateDefinition<SourceFollowUpPromptIntent, SourceFollowUpPromptInput>
> = {
  "source-ocr": {
    family: SOURCE_FOLLOW_UP_FAMILY,
    templateKey: "source-ocr",
    label: "OCR 解析",
    summary: "先把檔案轉成可追溯的結構化 JSON，不自動做後續知識動作。",
    outcome: "產出 page_count 與 json_gcs_uri，供後續處理使用。",
    version: PROMPT_VERSION,
    scenario: "source-preparation",
    system: "You are a document-ingestion planner. Focus on faithful OCR extraction and structured parsing only.",
    promptBuilder: (input) => [
      `請先針對檔案 ${input.filename} 進行 OCR / parse。`,
      "此步驟只負責取得結構化文字與頁碼資訊。",
      "不要直接建立 RAG 索引、Knowledge Page 或任務。",
    ].join("\n"),
  },
  "source-rag-index": {
    family: SOURCE_FOLLOW_UP_FAMILY,
    templateKey: "source-rag-index",
    label: "建立 RAG 索引",
    summary: "使用既有 parsed JSON 建立向量索引，不重新 OCR。",
    outcome: "把結構化文本切 chunk 並寫入檢索索引。",
    version: PROMPT_VERSION,
    scenario: "retrieval-preparation",
    system: "You are a retrieval-preparation planner. Use the parsed JSON as the source of truth and optimize for traceable indexing.",
    promptBuilder: (input) => [
      `請用 ${input.filename} 的既有 parsed JSON 建立 RAG 索引。`,
      `jsonReady=${input.jsonReady ? "true" : "false"}, pageCount=${input.pageCount ?? 0}`,
      "此流程不重新做 OCR，只建立可檢索的 chunk 與 metadata。",
    ].join("\n"),
  },
  "source-knowledge-page": {
    family: SOURCE_FOLLOW_UP_FAMILY,
    templateKey: "source-knowledge-page",
    label: "建立 Knowledge Page",
    summary: "將既有 parsed JSON 轉成可編輯的知識頁面草稿。",
    outcome: "建立單一 Knowledge Page，保留來源可追溯性。",
    version: PROMPT_VERSION,
    scenario: "knowledge-drafting",
    system: "You are a knowledge-authoring assistant. Create a clean, source-faithful draft page from parsed document text.",
    promptBuilder: (input) => [
      `請根據 ${input.filename} 的 parsed JSON 建立 Knowledge Page 草稿。`,
      "保留原始結構與重點段落，方便後續人工編輯與審核。",
    ].join("\n"),
  },
  "source-task-materialization": {
    family: SOURCE_FOLLOW_UP_FAMILY,
    templateKey: "source-task-materialization",
    label: "建立任務",
    summary: "先建立知識頁，再從 parsed text 萃取可執行任務。",
    outcome: "建立 Knowledge Page 並 materialize 到 Tasks。",
    version: PROMPT_VERSION,
    scenario: "workflow-materialization",
    system: "You are a workflow analyst. Convert document evidence into actionable, traceable tasks after the knowledge draft is created.",
    promptBuilder: (input, mode) => [
      `請根據 ${input.filename} 的 parsed JSON 產出任務。`,
      `模式：${mode === "workflow" ? "多步驟引導" : mode === "preview" ? "候選確認預覽" : "單一手動"}`,
      "先建立知識頁，再萃取具有可執行性的任務候選。",
    ].join("\n"),
  },
};

const TASK_EXTRACTION_PROMPTS: Record<
  TaskExtractionPromptIntent,
  PromptTemplateDefinition<TaskExtractionPromptIntent, TaskExtractionPromptInput>
> = {
  "document-task-candidates": {
    family: TASK_EXTRACTION_FAMILY,
    templateKey: "document-task-candidates",
    label: "任務候選萃取",
    summary: "從 parsed JSON / 文字內容中提取可確認的任務候選，供使用者預覽與勾選。",
    outcome: "回傳可執行的 task candidate 清單，而不是直接 materialize。",
    version: PROMPT_VERSION,
    scenario: "candidate-review",
    system: "You are a task distillation assistant. Extract only concrete and evidence-backed task candidates from the provided document content.",
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
  };
}

class SourceFollowUpPromptService implements PromptRegistryPort {
  listPromptFamilies(): ReadonlyArray<PromptTemplateFamily> {
    return [SOURCE_FOLLOW_UP_FAMILY, TASK_EXTRACTION_FAMILY];
  }

  listSourceFollowUpPrompts(mode: PromptExecutionMode = "manual"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(SOURCE_FOLLOW_UP_PROMPTS) as Array<
      PromptTemplateDefinition<SourceFollowUpPromptIntent, SourceFollowUpPromptInput>
    >).map((template) => toDescriptor(template, mode));
  }

  resolveSourceFollowUpPrompt(
    intent: SourceFollowUpPromptIntent,
    input: SourceFollowUpPromptInput,
    mode: PromptExecutionMode = "manual",
  ): ResolvedPrompt {
    return toResolvedPrompt(SOURCE_FOLLOW_UP_PROMPTS[intent], input, mode);
  }

  listTaskExtractionPrompts(mode: PromptExecutionMode = "preview"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.values(TASK_EXTRACTION_PROMPTS) as Array<
      PromptTemplateDefinition<TaskExtractionPromptIntent, TaskExtractionPromptInput>
    >).map((template) => toDescriptor(template, mode));
  }

  resolveTaskExtractionPrompt(
    intent: TaskExtractionPromptIntent,
    input: TaskExtractionPromptInput,
    mode: PromptExecutionMode = "preview",
  ): ResolvedPrompt {
    return toResolvedPrompt(TASK_EXTRACTION_PROMPTS[intent], input, mode);
  }
}

export const sourceFollowUpPromptService = new SourceFollowUpPromptService();
export const promptRegistryService = sourceFollowUpPromptService;

export function listPromptFamilies(): ReadonlyArray<PromptTemplateFamily> {
  return sourceFollowUpPromptService.listPromptFamilies();
}

export function listSourceFollowUpPrompts(
  mode: PromptExecutionMode = "manual",
): ReadonlyArray<PromptTemplateDescriptor> {
  return sourceFollowUpPromptService.listSourceFollowUpPrompts(mode);
}

export function resolveSourceFollowUpPrompt(
  intent: SourceFollowUpPromptIntent,
  input: SourceFollowUpPromptInput,
  mode: PromptExecutionMode = "manual",
): ResolvedPrompt {
  return sourceFollowUpPromptService.resolveSourceFollowUpPrompt(intent, input, mode);
}

export function listTaskExtractionPrompts(
  mode: PromptExecutionMode = "preview",
): ReadonlyArray<PromptTemplateDescriptor> {
  return sourceFollowUpPromptService.listTaskExtractionPrompts(mode);
}

export function resolveTaskExtractionPrompt(
  intent: TaskExtractionPromptIntent,
  input: TaskExtractionPromptInput,
  mode: PromptExecutionMode = "preview",
): ResolvedPrompt {
  return sourceFollowUpPromptService.resolveTaskExtractionPrompt(intent, input, mode);
}
