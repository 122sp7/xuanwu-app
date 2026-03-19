export type RagDocumentStatus = "uploaded" | "processing" | "ready" | "failed";

export interface RagDocumentRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly status: RagDocumentStatus;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface RagDocumentRepository {
  saveUploaded(record: RagDocumentRecord): Promise<void>;
}
