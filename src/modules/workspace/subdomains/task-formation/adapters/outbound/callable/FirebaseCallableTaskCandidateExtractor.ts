
import { z } from "zod";
import type { TaskCandidateExtractorPort, ExtractTaskCandidatesInput } from "../../../domain/ports/TaskCandidateExtractorPort";
import type { ExtractedTaskCandidate } from "../../../domain/value-objects/TaskCandidate";

const CandidateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  source: z.enum(["rule", "ai"]),
  confidence: z.number().min(0).max(1),
  sourceBlockId: z.string().optional(),
  sourceSnippet: z.string().optional(),
});

// Simple line items: "10 光纖熔接" or "10 高空作業費"
const LINE_ITEM_PATTERN = /^(\d{2,3})\s+/;
// Dense AP8 PO format: item number + 3RDTW product code + price block ending in 小計
// followed by Chinese section header （numeral） and task description.
// Capture groups:
//   1 — item number (10–540, step 10)
//   2 — section numeral character(s) (e.g., "伍" for Section 5 / 雜項費用)
//   3 — task description text (max 120 chars)
const PO_DENSE_PATTERN =
  /(?<!\d)(\d{2,3})\s+3RDTW\S+.*?小計[\d,，.]+\s*（([\u4e00-\u9fff]+)\s*）([^（\n]{1,120})/gs;

const MAX_TITLE_BODY_CHARS = 100;

// Chinese section numeral chars whose entire section is 費用管銷
const COST_SECTION_CHARS = new Set(["伍", "玖"]);

// Description-level patterns that indicate 費用管銷 regardless of section
const COST_DESC_PATTERNS: RegExp[] = [
  /費$/u,           // ends with 費 (高空作業費, 工程衛生費 …)
  /費用/u,          // 費用 anywhere
  /管理\d*人/u,     // management headcount
  /監工/u,
  /工安費/u,
  /保險/u,
  /分攤/u,
  /廢棄物/u,
  /5D/u,
  /利潤/u,
  /圖控與軟體/u,    // SCADA software deliverable (cost item)
  /圖面製作/u,
  /工務所/u,
  /雜費/u,
];

/**
 * FirebaseCallableTaskCandidateExtractor — working implementation of
 * TaskCandidateExtractorPort with Firebase-only runtime behavior.
 *
 * Supports two text formats:
 *   1. Clean line-item format: "10 光纖熔接" (simple rule-based extraction)
 *   2. Dense AP8 PO format from Document AI OCR/Layout Parser output with
 *      price blocks and Chinese section headers (po_dense path).
 *
 * Classification follows the AP8 PO 4510250181 two-category model:
 *   施工作業 — installation, cabling, construction, fiber splicing, positioning
 *   費用管銷 — management fees, insurance, sanitation, profit, software cost
 *
 * ESLint: @integration-firebase is allowed here — outbound adapter layer.
 */
export class FirebaseCallableTaskCandidateExtractor implements TaskCandidateExtractorPort {
  /** Classify a task description as 施工作業 or 費用管銷. */
  private _inferCategory(description: string, sectionChar?: string): "施工作業" | "費用管銷" {
    // Section-level override: 伍 (雜項費用) and 玖 (利潤及雜費) are always costs
    if (sectionChar && COST_SECTION_CHARS.has(sectionChar)) return "費用管銷";

    // Description-level pattern matching (highest precision, checked first)
    for (const pattern of COST_DESC_PATTERNS) {
      if (pattern.test(description)) return "費用管銷";
    }

    // Keyword-score fallback for unstructured text
    const costKeywords: readonly string[] = [
      "費用", "管銷", "保險", "分攤", "利潤", "廢棄物",
      "折扣", "稅", "總計", "金額", "單價",
      "profit", "cost", "tax", "discount",
    ];
    const workKeywords: readonly string[] = [
      "施工", "配線", "安裝", "架設", "熔接", "搬運", "建置",
      "工程", "線槽", "定位", "填塞", "拉配線", "基礎座", "光纖",
    ];
    const lower = description.toLowerCase();
    const costScore = costKeywords.filter((k) => lower.includes(k)).length;
    const workScore = workKeywords.filter((k) => lower.includes(k)).length;
    return costScore > workScore ? "費用管銷" : "施工作業";
  }

  /**
   * Extract candidates from dense AP8 PO text (Document AI OCR/Layout output).
   *
   * Matches pattern: {item_no} 3RDTW… …小計{amount}（{section}）{description}
   */
  private _extractDensePoCandidates(
    text: string,
    source: "rule" | "ai",
    sourceBlockId: string | undefined,
  ): Array<z.infer<typeof CandidateSchema>> {
    const candidates: Array<z.infer<typeof CandidateSchema>> = [];
    // Reset lastIndex before iterating (global regex)
    PO_DENSE_PATTERN.lastIndex = 0;
    for (const match of text.matchAll(PO_DENSE_PATTERN)) {
      const itemNo = match[1] ?? "";
      const sectionChar = (match[2] ?? "").trim();
      const description = (match[3] ?? "").trim().slice(0, MAX_TITLE_BODY_CHARS);
      if (!description) continue;
      const category = this._inferCategory(description, sectionChar);
      const sectionLabel = sectionChar ? `（${sectionChar}）` : "";
      candidates.push(
        CandidateSchema.parse({
          title: `[${category}] 項次${itemNo} ${sectionLabel}${description}`.trim(),
          description: `[分類] ${category}\n項次 ${itemNo}：${sectionLabel}${description}`,
          source,
          confidence: 0.92,
          sourceBlockId,
          sourceSnippet: (match[0] ?? "").slice(0, 240),
        }),
      );
    }
    return candidates;
  }

  async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]> {
    const normalizedText = (input.sourceText ?? "").trim();
    const sourcePageIds = input.sourcePageIds.filter((id) => id.trim().length > 0);
    const inferredSource = input.sourceType;
    const primarySource = sourcePageIds[0];

    // ── Path 1: Dense AP8 PO format detection ─────────────────────────────
    // If the text contains the ABB product code prefix "3RDTW", treat it as a
    // dense PO document and use the structured dense-PO extractor.
    if (/3RDTW/i.test(normalizedText)) {
      const denseCandidates = this._extractDensePoCandidates(
        normalizedText,
        inferredSource,
        primarySource,
      );
      if (denseCandidates.length > 0) return denseCandidates;
    }

    // ── Path 2: Simple line-item format ────────────────────────────────────
    const lines = normalizedText
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const lineItemCandidates = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => LINE_ITEM_PATTERN.test(line))
      .map(({ line }) => {
        const itemNo = (line.match(LINE_ITEM_PATTERN)?.[1] ?? "").trim();
        const body = line.replace(LINE_ITEM_PATTERN, "").trim();
        const titleBody = body.slice(0, MAX_TITLE_BODY_CHARS);
        if (!titleBody) return null;
        const category = this._inferCategory(titleBody);
        return {
          title: `[${category}] ${itemNo} ${titleBody}`.trim(),
          description: `[分類] ${category}\n${line}`,
          source: inferredSource,
          confidence: 0.9,
          sourceBlockId: primarySource,
          sourceSnippet: line.slice(0, 240),
        };
      })
      .filter((candidate): candidate is NonNullable<typeof candidate> => candidate !== null);

    const sentenceCandidates = normalizedText
      .split(/\r?\n|[。！？!?.]/g)
      .map((line) => line.trim())
      .filter((line) => line.length >= 6)
      .slice(0, 80)
      .map((line, index) => ({
        title: `[${this._inferCategory(line)}] ${line.slice(0, 60)}`,
        description: line,
        source: inferredSource,
        confidence: Math.max(0.55, 0.9 - index * 0.008),
        sourceBlockId: sourcePageIds[index] ?? primarySource,
        sourceSnippet: line.slice(0, 140),
      }));

    const sourceIdCandidates = sourcePageIds.map((sourcePageId, index) => ({
      title: `[施工作業] 來源任務 #${index + 1}`,
      description: `根據來源 ${sourcePageId} 建立可執行任務。`,
      source: inferredSource,
      confidence: Math.max(0.5, 0.75 - index * 0.05),
      sourceBlockId: sourcePageId,
      sourceSnippet: normalizedText.slice(0, 140) || sourcePageId,
    }));

    const merged = [...lineItemCandidates, ...sentenceCandidates, ...sourceIdCandidates]
      .slice(0, 200)
      .map((candidate) => CandidateSchema.parse(candidate));

    if (merged.length > 0) {
      return merged;
    }

    return [
      CandidateSchema.parse({
        title: "待確認任務（請補充來源內容）",
        description: "目前來源資料不足，請先選擇有效來源或補充文字內容後再生成。",
        source: inferredSource,
        confidence: 0.5,
      }),
    ];
  }
}
