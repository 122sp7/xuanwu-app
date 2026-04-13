/**
 * Module: notebooklm/subdomains/synthesis
 * Layer: domain/repositories
 * Purpose: RagRetrievalRepository — output port for chunk retrieval.
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

export interface RagRetrievalRepository {
  retrieve(input: RetrieveChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
