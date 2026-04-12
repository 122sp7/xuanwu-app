export interface ParseSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly documentId: string;
  readonly gcsUri: string;
  readonly filename: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export interface ParseSourceDocumentOutput {
  readonly documentId: string;
}

export interface ReindexSourceDocumentInput {
  readonly accountId: string;
  readonly workspaceId: string;
  readonly documentId: string;
  readonly jsonGcsUri: string;
  readonly sourceGcsUri: string;
  readonly filename: string;
  readonly pageCount: number;
}

export interface ReindexSourceDocumentOutput {
  readonly chunkCount: number;
  readonly vectorCount: number;
}

export interface ISourcePipelinePort {
  parseDocument(input: ParseSourceDocumentInput): Promise<ParseSourceDocumentOutput>;
  reindexDocument(input: ReindexSourceDocumentInput): Promise<ReindexSourceDocumentOutput>;
}
