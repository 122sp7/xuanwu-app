/**
 * Module: notebooklm/subdomains/ai
 * Layer: domain/entities
 * Purpose: Generation result types for the synthesis layer.
 *
 * Design notes:
 * - These types bridge grounding chunks → natural-language answer.
 * - RagRetrievedChunk is re-exported from retrieval entities for convenience;
 *   callers should use these types when working with generation output.
 */

import type { DomainError } from "@shared-types";

import type { RagRetrievedChunk } from "./retrieval.entities";

export type { RagRetrievedChunk };

/** Attribution claim within a generated answer */
export interface GenerationCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

/** Input to the generation port */
export interface GenerateRagAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly RagRetrievedChunk[];
  /** Optional model override (e.g. "googleai/gemini-2.5-pro"). Fall back to env default. */
  readonly model?: string;
}

/** Successful generation output */
export interface GenerateRagAnswerOutput {
  readonly answer: string;
  readonly citations: readonly GenerationCitation[];
  readonly model: string;
}

/** Discriminated union result (compatible with CommandResult pattern) */
export type GenerateRagAnswerResult =
  | { ok: true; data: GenerateRagAnswerOutput }
  | { ok: false; error: DomainError };
