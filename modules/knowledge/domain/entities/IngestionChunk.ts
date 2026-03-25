export interface IngestionChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly metadata: {
    readonly sourceDocId: string;
    readonly section?: string;
    readonly pageNumber?: number;
  };
}
