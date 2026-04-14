/**
 * JobChunk — value-like entity representing a text segment produced
 * by the chunking stage of the document processing pipeline.
 *
 * Produced downstream from the Python `py_fn` worker; tracked by the
 * platform layer for audit and retrieval-quality accounting.
 */

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
