import { randomUUID } from "node:crypto";

import type { RagGenerationRepository } from "../../domain/repositories/RagGenerationRepository";
import type { RagRerankerRepository } from "../../domain/repositories/RagRerankerRepository";
import type { RagRetrievalRepository } from "../../domain/repositories/RagRetrievalRepository";
import type {
  AnswerRagQueryInput,
  AnswerRagQueryResult,
  RagRetrievalSummary,
} from "../../domain/entities/RagQuery";

// Keep the default retrieval window small enough for prompt assembly while still leaving
// a broader cap for future rerank experiments on the same contract.
const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 10;
// After reranking, keep the top-N chunks for generation (ADR-004 §4).
const DEFAULT_RERANK_TOP_N = 3;

function normalizeTopK(value?: number) {
  if (value === undefined) {
    return DEFAULT_TOP_K;
  }

  if (!Number.isFinite(value)) {
    return DEFAULT_TOP_K;
  }

  return Math.min(MAX_TOP_K, Math.max(1, Math.trunc(value)));
}

export class AnswerRagQueryUseCase {
  constructor(
    private readonly ragRetrievalRepository: RagRetrievalRepository,
    private readonly ragGenerationRepository: RagGenerationRepository,
    private readonly ragRerankerRepository?: RagRerankerRepository,
  ) {}

  async execute(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
    const organizationId = input.organizationId.trim();
    const workspaceId = input.workspaceId?.trim() || undefined;
    const userQuery = input.userQuery.trim();
    const taxonomy = input.taxonomy?.trim() || undefined;
    const topK = normalizeTopK(input.topK);
    const traceId = `rag-trace-${randomUUID()}`;
    const scope = workspaceId ? "workspace" : "organization";

    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: "QUERY_FILTER_SCOPE_MISSING",
          message: "Organization is required for RAG queries.",
          context: { traceId, scope: "organizationId" },
        },
      };
    }

    if (!userQuery) {
      return {
        ok: false,
        error: {
          code: "QUERY_INVALID_INPUT",
          message: "User query is required.",
          context: { traceId },
        },
      };
    }

    const chunks = await this.ragRetrievalRepository.retrieve({
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
      normalizedQuery: userQuery.toLowerCase(),
      taxonomy,
      topK,
      ...(input.userRoles && input.userRoles.length > 0 ? { userRoles: input.userRoles } : {}),
    });

    if (chunks.length === 0) {
      return {
        ok: false,
        error: {
          code: "NO_RELEVANT_CHUNKS",
          message:
            "No ready chunks matched the current organization/workspace scope. Verify ingestion completed and documents are marked ready before querying.",
          context: { traceId, organizationId, workspaceId, taxonomy, topK, scope },
        },
      };
    }

    // Layer 12: Reranking — when a reranker is wired, re-score and re-order the
    // retrieved chunks using LLM-based relevance assessment (ADR-004 §4).
    const rankedChunks = this.ragRerankerRepository
      ? await this.ragRerankerRepository.rerank({
          userQuery,
          chunks,
          topN: Math.min(DEFAULT_RERANK_TOP_N, chunks.length),
        })
      : chunks;

    const generation = await this.ragGenerationRepository.generate({
      traceId,
      organizationId,
      ...(workspaceId ? { workspaceId } : {}),
      userQuery,
      chunks: rankedChunks,
      model: input.model,
    });

    if (!generation.ok) {
      return generation;
    }

    const retrievalSummary: RagRetrievalSummary = {
      mode: "skeleton-metadata-filter",
      scope,
      retrievedChunkCount: chunks.length,
      topK,
      ...(taxonomy ? { taxonomy } : {}),
    };

    return {
      ok: true,
      data: {
        answer: generation.data.answer,
        citations: generation.data.citations,
        retrievalSummary,
        model: generation.data.model,
        traceId,
        events: [
          {
            type: "token",
            traceId,
            payload: generation.data.answer,
          },
          ...generation.data.citations.map((citation) => ({
            type: "citation" as const,
            traceId,
            payload: citation,
          })),
          {
            type: "done",
            traceId,
            payload: retrievalSummary,
          },
        ],
      },
    };
  }
}
