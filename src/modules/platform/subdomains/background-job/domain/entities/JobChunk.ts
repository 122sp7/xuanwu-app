export interface JobChunkMetadata {
  readonly sourceDocId: string;
  readonly section?: string;
  readonly pageNumber?: number;
}

export interface JobChunk {
  readonly id: string;
  readonly documentId: string;
  readonly chunkIndex: number;
  readonly content: string;
  readonly metadata: JobChunkMetadata;
}
