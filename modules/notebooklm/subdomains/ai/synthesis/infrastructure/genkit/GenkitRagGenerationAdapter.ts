/**
 * Module: notebooklm/subdomains/ai/synthesis
 * Layer: infrastructure/genkit
 * Purpose: GenkitRagGenerationAdapter — implements IRagGenerationRepository
 *          using Genkit to invoke Google AI (or any configured model).
 *
 * Design notes:
 * - All prompt construction is encapsulated here (not in domain / use cases).
 * - Citations are derived from the input chunks, not re-extracted from the
 *   model output (avoids hallucination in citation attribution).
 * - Unhandled model errors are wrapped in a structured DomainError value.
 */

import type { IRagGenerationRepository } from "../../domain/repositories/IRagGenerationRepository";
import type {
  GenerateRagAnswerInput,
  GenerateRagAnswerOutput,
  GenerateRagAnswerResult,
  GenerationCitation,
} from "../../domain/entities/generation.entities";
import { synthesisAiClient, resolveGenerationModel } from "./genkit-ai-client";

// --- Prompt construction helpers (pure, testable) ----------------------------

function formatChunkForPrompt(chunk: GenerateRagAnswerInput["chunks"][number]): string {
  const pageLabel = typeof chunk.page === "number" ? ` page:${chunk.page}` : "";
  return `[doc:${chunk.docId} chunk:${chunk.chunkIndex}${pageLabel} taxonomy:${chunk.taxonomy}]\n${chunk.text}`;
}

function buildGenerationPrompt(input: GenerateRagAnswerInput): string {
  const contextBlocks = input.chunks.map(formatChunkForPrompt).join("\n\n---\n\n");
  return [
    "Use the retrieved context to answer the user query.",
    "If the context is incomplete, answer conservatively and keep citations grounded in the retrieved chunks.",
    `User query: ${input.userQuery}`,
    "Retrieved context:",
    contextBlocks,
  ].join("\n\n");
}

function buildCitations(input: GenerateRagAnswerInput): readonly GenerationCitation[] {
  return input.chunks.map((chunk) => ({
    docId: chunk.docId,
    chunkIndex: chunk.chunkIndex,
    ...(typeof chunk.page === "number" ? { page: chunk.page } : {}),
    reason: `Retrieved from ${chunk.taxonomy} context with relevance score ${chunk.score.toFixed(2)}.`,
  }));
}

// --- Adapter ------------------------------------------------------------------

const SYSTEM_PROMPT =
  "You are the Xuanwu RAG orchestration layer. Answer only from the supplied context and preserve citations.";

export class GenkitRagGenerationAdapter implements IRagGenerationRepository {
  async generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult> {
    try {
      const response = await synthesisAiClient.generate({
        prompt: buildGenerationPrompt(input),
        system: SYSTEM_PROMPT,
        ...(input.model ? { model: input.model } : {}),
      });

      const output: GenerateRagAnswerOutput = {
        answer: response.text,
        model: resolveGenerationModel(input.model),
        citations: buildCitations(input),
      };

      return { ok: true, data: output };
    } catch (error) {
      return {
        ok: false,
        error: {
          code: "SYNTHESIS_MODEL_PROVIDER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : `Unexpected synthesis error: ${String(error)}`,
          context: { traceId: input.traceId },
        },
      };
    }
  }
}
