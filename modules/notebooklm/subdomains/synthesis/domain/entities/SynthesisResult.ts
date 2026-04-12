/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/entities
 * Purpose: SynthesisResult — the generated answer with attribution.
 *
 * Migration source: ai/domain/entities/generation.entities.ts
 */

import type { DomainError } from "@shared-types";

/** Attribution claim within a generated answer */
export interface GenerationCitation {
  readonly docId: string;
  readonly chunkIndex: number;
  readonly page?: number;
  readonly reason: string;
}

/** Input to the generation port */
export interface GenerateAnswerInput {
  readonly traceId: string;
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly userQuery: string;
  readonly chunks: readonly {
    readonly chunkId: string;
    readonly docId: string;
    readonly chunkIndex: number;
    readonly text: string;
    readonly score: number;
  }[];
  readonly model?: string;
}

/** Successful generation output */
export interface GenerateAnswerOutput {
  readonly answer: string;
  readonly citations: readonly GenerationCitation[];
  readonly model: string;
}

/** Discriminated union result */
export type GenerateAnswerResult =
  | { ok: true; data: GenerateAnswerOutput }
  | { ok: false; error: DomainError };
