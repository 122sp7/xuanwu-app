export type RagDocumentStatus = "uploaded" | "processing" | "ready" | "failed" | "archived";

export const ALLOWED_RAG_DOCUMENT_STATUS_TRANSITIONS: Readonly<
  Record<RagDocumentStatus, readonly RagDocumentStatus[]>
> = {
  uploaded: ["processing"],
  processing: ["ready", "failed"],
  ready: ["processing", "archived"],
  failed: ["processing"],
  archived: [],
};

export function canTransitionRagDocumentStatus(
  fromStatus: RagDocumentStatus,
  toStatus: RagDocumentStatus,
): boolean {
  return ALLOWED_RAG_DOCUMENT_STATUS_TRANSITIONS[fromStatus].includes(toStatus);
}

export interface RagDocumentRecord {
  readonly id: string;
  readonly organizationId: string;
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
