import type {
  PromptExecutionMode,
  PromptRegistryPort,
  PromptTemplateDescriptor,
  ResolvedPrompt,
  SourceFollowUpPromptInput,
  SourceFollowUpPromptIntent,
} from "../domain";

const PROMPT_TEMPLATES: Record<
  SourceFollowUpPromptIntent,
  {
    readonly label: string;
    readonly summary: string;
    readonly outcome: string;
    readonly system: string;
    readonly promptBuilder: (input: SourceFollowUpPromptInput, mode: PromptExecutionMode) => string;
  }
> = {
  "source-ocr": {
    label: "OCR 解析",
    summary: "先把檔案轉成可追溯的結構化 JSON，不自動做後續知識動作。",
    outcome: "產出 page_count 與 json_gcs_uri，供後續處理使用。",
    system: "You are a document-ingestion planner. Focus on faithful OCR extraction and structured parsing only.",
    promptBuilder: (input) => [
      `請先針對檔案 ${input.filename} 進行 OCR / parse。`,
      "此步驟只負責取得結構化文字與頁碼資訊。",
      "不要直接建立 RAG 索引、Knowledge Page 或任務。",
    ].join("\n"),
  },
  "source-rag-index": {
    label: "建立 RAG 索引",
    summary: "使用既有 parsed JSON 建立向量索引，不重新 OCR。",
    outcome: "把結構化文本切 chunk 並寫入檢索索引。",
    system: "You are a retrieval-preparation planner. Use the parsed JSON as the source of truth and optimize for traceable indexing.",
    promptBuilder: (input) => [
      `請用 ${input.filename} 的既有 parsed JSON 建立 RAG 索引。`,
      `jsonReady=${input.jsonReady ? "true" : "false"}, pageCount=${input.pageCount ?? 0}`,
      "此流程不重新做 OCR，只建立可檢索的 chunk 與 metadata。",
    ].join("\n"),
  },
  "source-knowledge-page": {
    label: "建立 Knowledge Page",
    summary: "將既有 parsed JSON 轉成可編輯的知識頁面草稿。",
    outcome: "建立單一 Knowledge Page，保留來源可追溯性。",
    system: "You are a knowledge-authoring assistant. Create a clean, source-faithful draft page from parsed document text.",
    promptBuilder: (input) => [
      `請根據 ${input.filename} 的 parsed JSON 建立 Knowledge Page 草稿。`,
      "保留原始結構與重點段落，方便後續人工編輯與審核。",
    ].join("\n"),
  },
  "source-task-materialization": {
    label: "建立任務",
    summary: "先建立知識頁，再從 parsed text 萃取可執行任務。",
    outcome: "建立 Knowledge Page 並 materialize 到 Tasks。",
    system: "You are a workflow analyst. Convert document evidence into actionable, traceable tasks after the knowledge draft is created.",
    promptBuilder: (input, mode) => [
      `請根據 ${input.filename} 的 parsed JSON 產出任務。`,
      `模式：${mode === "workflow" ? "多步驟引導" : "單一手動"}`,
      "先建立知識頁，再萃取具有可執行性的任務候選。",
    ].join("\n"),
  },
};

class SourceFollowUpPromptService implements PromptRegistryPort {
  listSourceFollowUpPrompts(mode: PromptExecutionMode = "manual"): ReadonlyArray<PromptTemplateDescriptor> {
    return (Object.entries(PROMPT_TEMPLATES) as Array<[
      SourceFollowUpPromptIntent,
      (typeof PROMPT_TEMPLATES)[SourceFollowUpPromptIntent],
    ]>).map(([intent, template]) => ({
      intent,
      mode,
      label: template.label,
      summary: template.summary,
      outcome: template.outcome,
    }));
  }

  resolveSourceFollowUpPrompt(
    intent: SourceFollowUpPromptIntent,
    input: SourceFollowUpPromptInput,
    mode: PromptExecutionMode = "manual",
  ): ResolvedPrompt {
    const template = PROMPT_TEMPLATES[intent];
    return {
      intent,
      mode,
      label: template.label,
      summary: template.summary,
      system: template.system,
      prompt: template.promptBuilder(input, mode),
    };
  }
}

export const sourceFollowUpPromptService = new SourceFollowUpPromptService();

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
