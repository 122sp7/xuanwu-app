import { distillContent } from "@/modules/ai/api/server";
import type {
  KnowledgeDistillationInput,
  KnowledgeDistillationPort,
  KnowledgeDistillationResult,
} from "../../../subdomains/knowledge/domain/ports/KnowledgeDistillationPort";
import type {
  KnowledgeSummaryInput,
  KnowledgeSummaryPort,
  KnowledgeSummaryResult,
} from "../../../subdomains/knowledge/domain/ports/KnowledgeSummaryPort";

/**
 * Infrastructure adapter that lets Notion consume the shared AI bounded context
 * without embedding provider or Genkit ownership into the Notion module.
 */
export class SharedAiKnowledgeSummaryAdapter implements KnowledgeSummaryPort, KnowledgeDistillationPort {
  async summarizePage(input: KnowledgeSummaryInput): Promise<KnowledgeSummaryResult> {
    const result = await this.distillPage(input);

    return {
      summary: result.overview.trim(),
      model: result.model,
    };
  }

  async distillPage(input: KnowledgeDistillationInput): Promise<KnowledgeDistillationResult> {
    const result = await distillContent({
      objective: "Create a concise workspace knowledge preview and reusable knowledge highlights.",
      model: input.model,
      sources: [
        {
          title: input.title,
          text: input.plainText,
        },
      ],
    });

    return {
      overview: result.overview.trim(),
      highlights: result.distilledItems.map((item) => ({
        title: item.title,
        summary: item.summary,
      })),
      model: result.model,
      traceId: result.traceId,
      completedAt: result.completedAt,
    };
  }
}
