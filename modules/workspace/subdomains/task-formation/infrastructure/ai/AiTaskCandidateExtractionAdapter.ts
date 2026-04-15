import "server-only";

import { extractTasksFromContent } from "@/modules/ai/api/server";
import type {
  AIExtractedTaskCandidate,
  TaskCandidateExtractionPort,
} from "../../domain/ports/TaskCandidateExtractionPort";

/**
 * @module task-formation/infrastructure/ai
 * @file AiTaskCandidateExtractionAdapter.ts
 * @description Adapter implementing TaskCandidateExtractionPort.
 *
 * Delegates to the shared AI bounded context so task-formation never
 * depends on Genkit directly.
 */
export class AiTaskCandidateExtractionAdapter
  implements TaskCandidateExtractionPort
{
  async extractTaskCandidates(input: {
    readonly knowledgePageId: string;
    readonly content: string;
    readonly maxCandidates?: number;
    readonly sourceContext?: {
      readonly filename?: string;
      readonly mimeType?: string;
      readonly pageCount?: number;
      readonly sourceGcsUri?: string;
      readonly jsonGcsUri?: string;
    };
  }): Promise<ReadonlyArray<AIExtractedTaskCandidate>> {
    const result = await extractTasksFromContent({
      content: input.content,
      maxCandidates: input.maxCandidates,
      promptContext: {
        filename: input.sourceContext?.filename,
        mimeType: input.sourceContext?.mimeType,
        pageCount: input.sourceContext?.pageCount,
        sourceGcsUri: input.sourceContext?.sourceGcsUri,
        jsonGcsUri: input.sourceContext?.jsonGcsUri,
        jsonReady: true,
      },
    });

    return result.tasks.map((task) => ({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      confidence: 0.8,
    }));
  }
}
