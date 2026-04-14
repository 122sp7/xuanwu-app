import { summarize } from "@/modules/ai/api/server";
import type {
  KnowledgeSummaryInput,
  KnowledgeSummaryPort,
  KnowledgeSummaryResult,
} from "../../../subdomains/knowledge/domain/ports/KnowledgeSummaryPort";

const DEFAULT_SHARED_AI_MODEL = "shared-ai-default";

/**
 * Infrastructure adapter that lets Notion consume the shared AI bounded context
 * without embedding provider or Genkit ownership into the Notion module.
 */
export class SharedAiKnowledgeSummaryAdapter implements KnowledgeSummaryPort {
  async summarizePage(input: KnowledgeSummaryInput): Promise<KnowledgeSummaryResult> {
    const prompt = [
      "Summarize the following knowledge page for a workspace knowledge preview.",
      "Return concise plain text in 2-3 sentences.",
      `Title: ${input.title}`,
      "",
      input.plainText,
    ].join("\n");

    const summary = await summarize(prompt, input.model);

    return {
      summary: summary.trim(),
      model: input.model?.trim() || DEFAULT_SHARED_AI_MODEL,
    };
  }
}
