/**
 * Module: notebooklm/subdomains/ai/grounding
 * Layer: domain/repositories
 * Purpose: IRagRetrievalRepository — output port for chunk retrieval.
 *
 * Design notes:
 * - The domain defines the contract; Firebase / Upstash / etc. implement it.
 * - Retrieval is scoped to organization or workspace to enforce tenancy isolation.
 */

import type { RagRetrievedChunk } from "../entities/retrieval.entities";

export interface RetrieveChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}

export interface IRagRetrievalRepository {
  retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
