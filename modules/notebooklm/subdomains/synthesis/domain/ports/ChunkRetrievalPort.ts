/**
 * Module: notebooklm/subdomains/retrieval
 * Layer: domain/ports
 * Purpose: ChunkRetrievalPort — output port for chunk retrieval operations.
 *
 * Migration source: ai/domain/repositories/RagRetrievalRepository.ts
 * Infrastructure adapters (Firebase, Upstash, etc.) implement this port.
 */

import type { RetrievedChunk } from "../entities/RetrievedChunk";

export interface RetrieveChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}

export interface ChunkRetrievalPort {
  retrieve(input: RetrieveChunksInput): Promise<readonly RetrievedChunk[]>;
}
