import type { RagRetrievedChunk } from "../entities/RagQuery";

export interface RetrieveRagChunksInput {
  readonly organizationId: string;
  readonly workspaceId?: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
  /** Caller's access-control roles for RBAC filtering (Layer 11). */
  readonly userRoles?: readonly string[];
}

export interface RagRetrievalRepository {
  retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
