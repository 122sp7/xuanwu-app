
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
    const costKeywords = [
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
    return costKeywords.some((keyword) => normalized.includes(keyword.toLowerCase()))
      ? "費用管銷"
      : "施工作業";
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
      .filter(({ line }) => /^\d{2,3}\s+/.test(line))
      .map(({ line, index }) => {
        const itemNo = (line.match(/^(\d{2,3})\s+/)?.[1] ?? "").trim();
        const body = line.replace(/^\d{2,3}\s+/, "").trim();
        const titleBody = body.slice(0, 100) || `項次 ${itemNo}`;
        const category = this._inferCategory(titleBody);
        return {
          title: `[${category}] ${itemNo} ${titleBody}`.trim(),
          description: `[分類] ${category}\n${line}`,
          source: inferredSource,
          confidence: Math.max(0.6, 0.96 - index * 0.002),
          sourceBlockId: primarySource,
          sourceSnippet: line.slice(0, 240),
        };
      });

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
