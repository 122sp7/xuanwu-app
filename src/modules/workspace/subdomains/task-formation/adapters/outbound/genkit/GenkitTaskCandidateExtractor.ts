import type { TaskCandidateExtractorPort, ExtractTaskCandidatesInput } from "../../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractedTaskCandidate } from "../../../domain/value-objects/TaskCandidate";

// ── Flow I/O types (replicated to avoid static z import at module scope) ──────

interface TaskCandidateItem {
  title: string;
  description?: string;
  dueDate?: string;
  confidence: number;
  sourceSnippet?: string;
}

interface ExtractFlowOutput {
  candidates: TaskCandidateItem[];
}

// ── Prompt builder ─────────────────────────────────────────────────────────────

function buildExtractionPrompt(sourceText: string, pageRefs: string): string {
  return [
    "你是工作任務分析助理。請從以下工作區文件內容中識別可執行的任務項目。",
    sourceText ? `文件內容：\n${sourceText}` : "",
    pageRefs ? `來源頁面 ID：${pageRefs}` : "",
    "",
    "請以 JSON 格式回應，輸出 candidates 陣列，每個項目包含：",
    "- title: 任務標題（必填，最多 120 字）。標題必須以分類前綴開頭，格式：[施工作業] ... 或 [費用管銷] ...",
    "- description: 詳細說明（選填）",
    "- dueDate: 截止日期，ISO 8601 格式（選填，若無則省略）",
    "- confidence: 信心分數 0.0–1.0",
    "- sourceSnippet: 原文片段（選填）",
    "",
    "分類只能使用兩種：施工作業、費用管銷。",
    "若來源含有項次/明細（例如 10, 20, ...），請逐項輸出，不可任意合併或省略。",
    "只輸出高品質、具體可執行的任務，不含泛泛管理性項目。",
  ]
    .filter(Boolean)
    .join("\n");
}

// ── Adapter ────────────────────────────────────────────────────────────────────

/**
 * GenkitTaskCandidateExtractor — synchronous Genkit flow implementation of
 * TaskCandidateExtractorPort.
 *
 * Flow name: workspace.extract-task-candidates
 * Model: DEFAULT_AI_MODEL (gemini-2.5-flash) via shared Genkit singleton.
 * I/O validated with Zod per @integration-ai/README guardrails.
 *
 * ADR: AI extraction → synchronous Genkit flow (option A).
 *
 * Dynamic import: genkit is loaded lazily inside `extract()` to keep static
 * genkit imports out of browser bundles. firebase-composition.ts is transitively
 * imported by client components; a top-level `import { ai } from genkit` would
 * pull Node.js-only genkit deps into the browser bundle.
 *
 * ESLint: Genkit dynamic import is permitted here — outbound adapter layer.
 */
export class GenkitTaskCandidateExtractor implements TaskCandidateExtractorPort {
  async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]> {
    // Dynamic import — keeps Node.js-only genkit deps out of browser bundles.
    const { ai, z } = await import("@/packages/integration-ai/genkit");

    const ExtractFlowOutputSchema = z.object({
      candidates: z.array(
        z.object({
          title: z.string().min(1).max(120),
          description: z.string().optional(),
          dueDate: z.string().optional(),
          confidence: z.coerce.number().min(0).max(1),
          sourceSnippet: z.string().optional(),
        }),
      ),
    });

    const sourceText = (input.sourceText ?? "").trim();
    const pageRefs = input.sourcePageIds.join(", ");

    const response = await ai.generate({
      prompt: buildExtractionPrompt(sourceText, pageRefs),
      output: {
        format: "json",
        schema: ExtractFlowOutputSchema,
      },
    });

    const parsed: ExtractFlowOutput = ExtractFlowOutputSchema.parse(response.output);

    return parsed.candidates.map((c) => ({
      title: c.title,
      description: c.description,
      dueDate: c.dueDate,
      source: "ai" as const,
      confidence: c.confidence,
      sourceSnippet: c.sourceSnippet,
    }));
  }
}
