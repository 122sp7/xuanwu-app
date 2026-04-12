/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: RAG Q&A domain types — inputs, outputs, streaming events.
 *
 * Design notes:
 * - AnswerRagQueryInput / Output represent the public contract for the Q&A use case.
 * - RagStreamEvent models the streaming surface (for future streaming support).
 * - RagCitation re-exported from grounding for Q&A consumer convenience.
 */

import type { DomainError } from "@shared-types";

import type { RagCitation, RagRetrievalSummary } from "./retrieval.entities";

export type { RagCitation, RagRetrievalSummary };

export interface AnswerRagQueryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly taxonomy?: string;
  readonly topK?: number;
  readonly model?: string;
}

export interface AnswerRagQueryOutput {
  readonly answer: string;
  readonly citations: readonly RagCitation[];
  readonly retrievalSummary: RagRetrievalSummary;
  readonly model: string;
  readonly traceId: string;
  readonly events: readonly RagStreamEvent[];
}

export type AnswerRagQueryResult =
  | { ok: true; data: AnswerRagQueryOutput }
  | { ok: false; error: DomainError };

/** Streaming event for progressive answer delivery (extensibility hook) */
export interface RagStreamEvent {
  readonly type: "token" | "citation" | "done" | "error";
  readonly traceId: string;
  readonly payload: string | RagCitation | RagRetrievalSummary | DomainError;
}
