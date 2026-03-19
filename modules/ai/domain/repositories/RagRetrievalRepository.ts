import type { RagRetrievedChunk } from "../entities/RagQuery";

export interface RetrieveRagChunksInput {
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly normalizedQuery: string;
  readonly taxonomy?: string;
  readonly topK: number;
}

export interface RagRetrievalRepository {
  retrieve(input: RetrieveRagChunksInput): Promise<readonly RagRetrievedChunk[]>;
}
