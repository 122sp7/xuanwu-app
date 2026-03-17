export interface RetrievalChunkRefEntity {
  id: string;
  orgId: string;
  documentId: string;
  content: string;
  taxonomyRef?: string;
  score: number;
  version: number;
  updatedAt: Date;
}

export interface RetrievalSearchInput {
  orgId: string;
  query: string;
  taxonomyRef?: string;
  limit?: number;
}
