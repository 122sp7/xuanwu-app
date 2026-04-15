import type {
  PromptExecutionMode,
  PromptRegistryPort,
  PromptTemplateDescriptor,
  PromptTemplateFamily,
  PromptTemplateKey,
  ResolvedPrompt,
  TaskExtractionPromptInput,
  TaskExtractionPromptIntent,
} from "../domain";

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

class PromptRegistryService implements PromptRegistryPort {
  listPromptFamilies(): ReadonlyArray<PromptTemplateFamily> {
    return [TASK_EXTRACTION_FAMILY];
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

export const promptRegistryService = new PromptRegistryService();

export function listPromptFamilies(): ReadonlyArray<PromptTemplateFamily> {
  return promptRegistryService.listPromptFamilies();
}

export function listTaskExtractionPrompts(
  mode: PromptExecutionMode = "preview",
): ReadonlyArray<PromptTemplateDescriptor> {
  return promptRegistryService.listTaskExtractionPrompts(mode);
}

export function resolveTaskExtractionPrompt(
  intent: TaskExtractionPromptIntent,
  input: TaskExtractionPromptInput,
  mode: PromptExecutionMode = "preview",
): ResolvedPrompt {
  return promptRegistryService.resolveTaskExtractionPrompt(intent, input, mode);
}
