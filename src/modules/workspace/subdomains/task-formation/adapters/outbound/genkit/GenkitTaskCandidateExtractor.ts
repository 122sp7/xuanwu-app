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
    "你是工作任務分析助理，專門處理 AP8 SCADA 專案的採購訂單（PO 4510250181）。",
    "請從以下文件內容中識別所有可執行的任務項目，共應有 54 個任務（項次 10–540，步進 10）。",
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
    "",
    "【施工作業】判定準則（符合任一即為施工作業）：",
    "  - 涉及施工、安裝、配線、建置、搬運、測試、線槽、管路、定位、熔接等實體工程作業",
    "  - 涉及 SCADA RTU 盤、Server 機櫃、Frontend 機櫃、GPS 天線、光纖、DC Charger、溫控器等設備的安裝",
    "  - 涉及配電盤搬運、基礎座製作、EPOXY、盤間控制線等現場施作",
    "  - 涉及防火填塞、臨時電測試盤、臨時門施作等假設工程",
    "  - 典型項目：既設/新設 RTU、光纖熔接、線槽架設、基礎座製作、跨棟光纖、防火填塞",
    "",
    "【費用管銷】判定準則（符合任一即為費用管銷）：",
    "  - 描述結尾為「費」（如：高空作業費、工程衛生費、工安費）",
    "  - 含有「費用」、「管理Ｎ人＊Ｍ個月」、「監工」、「保險」、「分攤」、「廢棄物」、「5D」、「利潤」",
    "  - 屬於（伍）雜項費用 或 （玖）利潤及雜費 章節",
    "  - 圖控與軟體（SCADA 軟體採購成本）",
    "  - 文件及圖面製作費、工務所費用、雜項另料",
    "  - 典型項目：高空作業費、變電站管理費、監工費、保險費、廢棄物處理、利潤及雜費",
    "",
    "若來源含有項次/明細（例如 10, 20, 30, ...），請逐項輸出，不可任意合併或省略。",
    "文件為密集格式時，描述通常位於「小計{金額}（章節符號）」之後。",
    "只輸出有效任務項目，不含合計行或文件標頭。",
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
