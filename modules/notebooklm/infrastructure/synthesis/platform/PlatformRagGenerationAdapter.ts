/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: infrastructure/platform
 * Purpose: Implements IRagGenerationRepository by delegating model invocation
 *          to platform AI API. Prompt construction and citation building stay
 *          in this adapter (domain-specific to synthesis).
 *
 * All Genkit wiring lives exclusively in
 * modules/platform/subdomains/ai/infrastructure.
 */

import { generateAiText } from "@/modules/platform/api/server";
import type { IRagGenerationRepository } from "../../../subdomains/synthesis/domain/repositories/IRagGenerationRepository";
import type {
  GenerateRagAnswerInput,
  GenerateRagAnswerResult,
  GenerateRagAnswerOutput,
  GenerationCitation,
} from "../../../subdomains/synthesis/domain/entities/generation.entities";

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

export class PlatformRagGenerationAdapter implements IRagGenerationRepository {
  async generate(input: GenerateRagAnswerInput): Promise<GenerateRagAnswerResult> {
    try {
      const result = await generateAiText({
        prompt: buildGenerationPrompt(input),
        system: SYSTEM_PROMPT,
        ...(input.model ? { model: input.model } : {}),
      });

      const output: GenerateRagAnswerOutput = {
        answer: result.text,
        model: result.model,
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
