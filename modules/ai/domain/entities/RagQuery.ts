import type { DomainError } from "@shared-types";

export interface RagRetrievedChunk {
  readonly chunkId: string;
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly taxonomy: string;
  readonly text: string;
  readonly score: number;
}

export interface RagCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

export interface RagRetrievalSummary {
  readonly mode: "skeleton-metadata-filter";
  readonly scope: "organization" | "workspace";
  readonly retrievedChunkCount: number;
  readonly topK: number;
  readonly taxonomy?: string;
}

export interface RagStreamEvent {
  readonly type: "token" | "citation" | "done" | "error";
  readonly traceId: string;
  readonly payload: string | RagCitation | RagRetrievalSummary | DomainError;
}

export interface AnswerRagQueryInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly taxonomy?: string;
  readonly topK?: number;
  readonly model?: string;
  /** Caller's access-control roles for RBAC filtering (Layer 11). */
  readonly userRoles?: readonly string[];
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
