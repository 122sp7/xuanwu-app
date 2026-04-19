
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
  async extract(input: ExtractTaskCandidatesInput): Promise<ExtractedTaskCandidate[]> {
    const normalizedText = (input.sourceText ?? "").trim();
    const sourcePageIds = input.sourcePageIds.filter((id) => id.trim().length > 0);
    const inferredSource = input.sourceType;

    const sentenceCandidates = normalizedText
      .split(/\r?\n|[。！？!?.]/g)
      .map((line) => line.trim())
      .filter((line) => line.length >= 6)
      .slice(0, 5)
      .map((line, index) => ({
        title: line.slice(0, 60),
        description: line,
        source: inferredSource,
        confidence: Math.max(0.55, 0.9 - index * 0.08),
        sourceBlockId: sourcePageIds[index] ?? sourcePageIds[0],
        sourceSnippet: line.slice(0, 140),
      }));

    const sourceIdCandidates = sourcePageIds.map((sourcePageId, index) => ({
      title: `來源任務 #${index + 1}`,
      description: `根據來源 ${sourcePageId} 建立可執行任務。`,
      source: inferredSource,
      confidence: Math.max(0.5, 0.75 - index * 0.05),
      sourceBlockId: sourcePageId,
      sourceSnippet: normalizedText.slice(0, 140) || sourcePageId,
    }));

    const merged = [...sentenceCandidates, ...sourceIdCandidates]
      .slice(0, 8)
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
