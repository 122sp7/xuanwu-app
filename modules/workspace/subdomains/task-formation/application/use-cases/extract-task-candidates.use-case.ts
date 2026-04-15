/**
 * @module task-formation/application/use-cases
 * @file extract-task-candidates.use-case.ts
 * @description Extract task candidates from parsed knowledge blocks using AI.
 */

import type { ExtractTaskCandidatesDto, ExtractTaskCandidatesResult, ExtractedTaskCandidate } from "../dto/index";
import type { TaskCandidateExtractionPort } from "../../domain/ports/TaskCandidateExtractionPort";

function mergeUnique(
  candidates: ReadonlyArray<ExtractedTaskCandidate>,
): ReadonlyArray<ExtractedTaskCandidate> {
  const dedup = new Map<string, ExtractedTaskCandidate>();
  for (const candidate of candidates) {
    const key = candidate.title.trim().toLowerCase();
    if (!key) continue;
    const existing = dedup.get(key);
    if (!existing || candidate.confidence > existing.confidence) {
      dedup.set(key, candidate);
    }
  }
  return [...dedup.values()];
}

export class ExtractTaskCandidatesUseCase {
  constructor(private readonly aiPort?: TaskCandidateExtractionPort) {}

  async execute(dto: ExtractTaskCandidatesDto): Promise<ExtractTaskCandidatesResult> {
    const knowledgePageId = dto.knowledgePageId.trim();
    if (!knowledgePageId) {
      return { candidates: [], usedAiFallback: false };
    }

    const cleanedBlocks = dto.blocks
      .map((block) => ({ ...block, blockId: block.blockId.trim(), text: block.text.trim() }))
      .filter((block) => block.blockId && block.text);

    if (cleanedBlocks.length === 0 || dto.enableAiFallback === false || !this.aiPort) {
      return { candidates: [], usedAiFallback: false };
    }

    const mergedContent = cleanedBlocks.map((b) => b.text).join("\n\n");

    try {
      const aiCandidates = await this.aiPort.extractTaskCandidates({
        knowledgePageId,
        content: mergedContent,
        maxCandidates: 30,
        sourceContext: dto.sourceContext,
      });

      const normalized: ExtractedTaskCandidate[] = aiCandidates
        .map((item) => ({
          title: item.title.trim(),
          description: item.description,
          dueDate: item.dueDate,
          source: "ai" as const,
          confidence: item.confidence ?? 0.72,
          sourceSnippet: item.sourceSnippet,
        }))
        .filter((item) => item.title.length > 0);

      const merged = mergeUnique(normalized);
      return { candidates: merged, usedAiFallback: merged.length > 0 };
    } catch {
      return { candidates: [], usedAiFallback: false };
    }
  }
}
