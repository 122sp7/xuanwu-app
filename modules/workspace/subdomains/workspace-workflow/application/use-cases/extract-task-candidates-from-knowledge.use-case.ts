/**
 * @module workspace-flow/application/use-cases
 * @file extract-task-candidates-from-knowledge.use-case.ts
 * @description Extract task candidates from knowledge blocks with rule-first strategy.
 */

import type {
  ExtractTaskCandidatesFromKnowledgeDto,
  ExtractTaskCandidatesFromKnowledgeResult,
  ExtractedTaskCandidate,
} from "../dto/extract-task-candidates-from-knowledge.dto";
import type { TaskCandidateExtractionAiPort } from "../../domain/ports/TaskCandidateExtractionAiPort";
import { TaskCandidateRuleExtractor } from "../services/TaskCandidateRuleExtractor";

function mergeUnique(candidates: ReadonlyArray<ExtractedTaskCandidate>): ReadonlyArray<ExtractedTaskCandidate> {
  const dedup = new Map<string, ExtractedTaskCandidate>();
  for (const candidate of candidates) {
    const normalizedTitle = candidate.title.trim().toLowerCase();
    if (!normalizedTitle) continue;
    const existing = dedup.get(normalizedTitle);
    if (!existing || candidate.confidence > existing.confidence) {
      dedup.set(normalizedTitle, candidate);
    }
  }
  return [...dedup.values()];
}

export class ExtractTaskCandidatesFromKnowledgeUseCase {
  private readonly ruleExtractor = new TaskCandidateRuleExtractor();

  constructor(private readonly aiPort?: TaskCandidateExtractionAiPort) {}

  async execute(
    dto: ExtractTaskCandidatesFromKnowledgeDto,
  ): Promise<ExtractTaskCandidatesFromKnowledgeResult> {
    const knowledgePageId = dto.knowledgePageId.trim();
    if (!knowledgePageId) {
      return { candidates: [], usedAiFallback: false };
    }

    const cleanedBlocks = dto.blocks
      .map((block) => ({
        ...block,
        blockId: block.blockId.trim(),
        text: block.text.trim(),
      }))
      .filter((block) => block.blockId && block.text);

    const ruleCandidates = this.ruleExtractor.extract(cleanedBlocks);
    if (ruleCandidates.length > 0 || dto.enableAiFallback === false || !this.aiPort) {
      return { candidates: ruleCandidates, usedAiFallback: false };
    }

    const mergedContent = cleanedBlocks.map((block) => block.text).join("\n\n");
    const aiCandidates = await this.aiPort.extractTaskCandidates({
      knowledgePageId,
      content: mergedContent,
      maxCandidates: 30,
    });

    const normalizedAiCandidates: ExtractedTaskCandidate[] = aiCandidates
      .map((item) => ({
        title: item.title.trim(),
        description: item.description,
        dueDate: item.dueDate,
        source: "ai" as const,
        confidence: item.confidence ?? 0.72,
        sourceSnippet: item.sourceSnippet,
      }))
      .filter((item) => item.title.length > 0);

    return {
      candidates: mergeUnique(normalizedAiCandidates),
      usedAiFallback: true,
    };
  }
}
