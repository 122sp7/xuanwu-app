import type { RagGenerationRepository } from "../../domain/repositories/RagGenerationRepository";
import type { RagRetrievalRepository } from "../../domain/repositories/RagRetrievalRepository";
import type { AnswerRagQueryInput, AnswerRagQueryResult, RagRetrievalSummary } from "../../domain/entities/RagQuery";

const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 10;

function normalizeTopK(value?: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_TOP_K;
  }

  return Math.min(MAX_TOP_K, Math.max(1, Math.trunc(value ?? DEFAULT_TOP_K)));
}

export class AnswerRagQueryUseCase {
  constructor(
    private readonly ragRetrievalRepository: RagRetrievalRepository,
    private readonly ragGenerationRepository: RagGenerationRepository,
  ) {}

  async execute(input: AnswerRagQueryInput): Promise<AnswerRagQueryResult> {
    const tenantId = input.tenantId.trim();
    const workspaceId = input.workspaceId.trim();
    const userQuery = input.userQuery.trim();
    const taxonomy = input.taxonomy?.trim() || undefined;
    const topK = normalizeTopK(input.topK);
    const traceId = `rag-trace-${crypto.randomUUID()}`;

    if (!tenantId) {
      return {
        ok: false,
        error: {
          code: "QUERY_FILTER_SCOPE_MISSING",
          message: "Tenant is required for RAG queries.",
          context: { traceId, scope: "tenantId" },
        },
      };
    }

    if (!workspaceId) {
      return {
        ok: false,
        error: {
          code: "QUERY_FILTER_SCOPE_MISSING",
          message: "Workspace is required for RAG queries.",
          context: { traceId, scope: "workspaceId" },
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
      tenantId,
      workspaceId,
      normalizedQuery: userQuery.toLowerCase(),
      taxonomy,
      topK,
    });

    if (chunks.length === 0) {
      return {
        ok: false,
        error: {
          code: "NO_RELEVANT_CHUNKS",
          message: "No ready chunks matched the current tenant/workspace scope.",
          context: { traceId, tenantId, workspaceId, taxonomy, topK },
        },
      };
    }

    const generation = await this.ragGenerationRepository.generate({
      traceId,
      tenantId,
      workspaceId,
      userQuery,
      chunks,
      model: input.model,
    });

    if (!generation.ok) {
      return generation;
    }

    const retrievalSummary: RagRetrievalSummary = {
      mode: "skeleton-metadata-filter",
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
