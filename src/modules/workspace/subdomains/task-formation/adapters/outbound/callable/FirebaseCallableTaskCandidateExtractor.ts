
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

const LINE_ITEM_PATTERN = /^(\d{2,3})\s+/;
const MAX_TITLE_BODY_CHARS = 100;

/**
 * FirebaseCallableTaskCandidateExtractor — working implementation of
 * TaskCandidateExtractorPort with Firebase-only runtime behavior.
 *
 * This adapter intentionally avoids fn callable dependency and generates
 * candidates from workspace-side context (`sourceText`, `sourcePageIds`) so
 * task-formation can be completed within Next.js + Firebase flow.
 *
 * ESLint: @integration-firebase is allowed here — outbound adapter layer.
 */
export class FirebaseCallableTaskCandidateExtractor implements TaskCandidateExtractorPort {
  private _inferCategory(text: string): "施工作業" | "費用管銷" {
    const normalized = text.toLowerCase();
    const costKeywords: readonly string[] = [
      "費",
      "折扣",
      "稅",
      "總計",
      "小計",
      "金額",
      "單價",
      "profit",
      "price",
      "cost",
      "amount",
      "tax",
      "discount",
    ];
    const workKeywords: readonly string[] = [
      "施工",
      "配線",
      "安裝",
      "架設",
      "熔接",
      "搬運",
      "建置",
      "作業",
      "工程",
      "線槽",
      "定位",
    ];
    const costScore = costKeywords.filter((keyword) => normalized.includes(keyword)).length;
    const workScore = workKeywords.filter((keyword) => normalized.includes(keyword)).length;
    return costScore >= workScore ? "費用管銷" : "施工作業";
  }

  async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]> {
    const normalizedText = (input.sourceText ?? "").trim();
    const sourcePageIds = input.sourcePageIds.filter((id) => id.trim().length > 0);
    const inferredSource = input.sourceType;
    const primarySource = sourcePageIds[0];

    const lines = normalizedText
      .split(/\r?\n/g)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const lineItemCandidates = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => LINE_ITEM_PATTERN.test(line))
      .map(({ line, index }) => {
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
