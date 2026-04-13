/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: application/use-cases
 * Purpose: AnswerRagQueryUseCase — orchestrates grounding + synthesis to
 *          produce a cited answer for a user question.
 *
 * Design improvements over legacy answer-rag-query.use-case.ts:
 * - TopK limit is configurable via constructor injection (no hard-coded MAX_TOP_K=10).
 * - Error codes are prefixed with QA_ for namespace clarity.
 * - Dependencies typed against interfaces, not concrete classes.
 */

import { randomUUID } from "node:crypto";

import type { RagRetrievalRepository } from "../../domain/repositories/RagRetrievalRepository";
import type {
  AnswerRagQueryInput,
  AnswerRagQueryOutput,
  AnswerRagQueryResult,
  RagRetrievalSummary,
} from "../../domain/entities/rag-query.entities";
import type { RagGenerationRepository } from "../../domain/repositories/RagGenerationRepository";

const DEFAULT_TOP_K = 5;
const DEFAULT_MAX_TOP_K = 20; // Raise from the legacy hard-coded 10

function clampTopK(value: number | undefined, maxTopK: number): number {
  if (value === undefined || !Number.isFinite(value)) return DEFAULT_TOP_K;
  return Math.min(maxTopK, Math.max(1, Math.trunc(value)));
}

export class AnswerRagQueryUseCase {
  constructor(
    private readonly retrievalRepository: RagRetrievalRepository,
    private readonly generationRepository: RagGenerationRepository,
    /** Maximum topK accepted from callers. Override at composition root for environment-specific limits. */
    private readonly maxTopK: number = DEFAULT_MAX_TOP_K,
  ) {}

  async execute(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId?.trim() || undefined;
    const userQuery = input.userQuery.trim();
    const taxonomy = input.taxonomy?.trim() || undefined;
    const topK = clampTopK(input.topK, this.maxTopK);
    const traceId = `rag-trace-${randomUUID()}`;
    const scope: RagRetrievalSummary["scope"] = workspaceId ? "workspace" : "organization";

    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: "QA_SCOPE_MISSING",
          message: "organizationId is required for RAG queries.",
          context: { traceId, scope: "organizationId" },
        },
      };
    }

    if (!userQuery) {
      return {
        ok: false,
        error: {
          code: "QA_QUERY_EMPTY",
          message: "userQuery must not be empty.",
          context: { traceId },
        },
      };
    }

    const chunks = await this.retrievalRepository.retrieve({
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
      normalizedQuery: userQuery.toLowerCase(),
      taxonomy,
      topK,
    });

    if (chunks.length === 0) {
      return {
        ok: false,
        error: {
          code: "QA_NO_RELEVANT_CHUNKS",
          message:
            "No ready chunks matched the query scope. Verify ingestion completed and documents are marked ready.",
          context: { traceId, organizationId, workspaceId, taxonomy, topK, scope },
        },
      };
    }

    const generationResult = await this.generationRepository.generate({
      traceId,
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
      userQuery,
      chunks,
      ...(input.model ? { model: input.model } : {}),
    });

    if (!generationResult.ok) {
      return { ok: false, error: generationResult.error };
    }

    const retrievalSummary: RagRetrievalSummary = {
      mode: "skeleton-metadata-filter",
      scope,
      retrievedChunkCount: chunks.length,
      topK,
      ...(taxonomy ? { taxonomy } : {}),
    };

    const output: AnswerRagQueryOutput = {
      answer: generationResult.data.answer,
      citations: generationResult.data.citations,
      retrievalSummary,
      model: generationResult.data.model,
      traceId,
      events: [],
    };

    return { ok: true, data: output };
  }
}
