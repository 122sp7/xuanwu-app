import type {
  GenerateRagAnswerInput,
  GenerateRagAnswerResult,
  RagGenerationRepository,
} from "../../domain/repositories/RagGenerationRepository";
import { aiClient, getConfiguredGenkitModel } from "./client";

function buildPrompt(input: GenerateRagAnswerInput) {
  const context = input.chunks
    .map(
      (chunk) =>
        `[doc:${chunk.docId} chunk:${chunk.chunkIndex}${typeof chunk.page === "number" ? ` page:${chunk.page}` : ""} taxonomy:${chunk.taxonomy}]\n${chunk.text}`,
    )
    .join("\n\n---\n\n");

  return [
    "Use the retrieved context to answer the user query.",
    "If the context is incomplete, answer conservatively and keep citations grounded in the retrieved chunks.",
    `User query: ${input.userQuery}`,
    "Retrieved context:",
    context,
  ].join("\n\n");
}

export class GenkitRagGenerationRepository implements RagGenerationRepository {
  async generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult> {
    try {
      const response = await aiClient.generate({
        prompt: buildPrompt(input),
        system:
          "You are the Xuanwu RAG orchestration layer. Answer only from the supplied context and preserve citations.",
        ...(input.model ? { model: input.model } : {}),
      });

      return {
        ok: true,
        data: {
          answer: response.text,
          model: getConfiguredGenkitModel(input.model),
          citations: input.chunks.slice(0, 3).map((chunk) => ({
            docId: chunk.docId,
            chunkIndex: chunk.chunkIndex,
            ...(typeof chunk.page === "number" ? { page: chunk.page } : {}),
            reason: `Retrieved from ${chunk.taxonomy} context with score ${chunk.score.toFixed(2)}.`,
          })),
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "FLOW_MODEL_PROVIDER_ERROR",
          message:
            error instanceof Error ? error.message : `Unexpected RAG generation error: ${String(error)}`,
          context: { traceId: input.traceId },
        },
      };
    }
  }
}
