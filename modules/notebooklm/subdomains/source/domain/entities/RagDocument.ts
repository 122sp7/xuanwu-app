/**
 * Module: notebooklm/subdomains/source
 * Layer: domain/entities
 * Aggregate: RagDocument — tracks the ingestion lifecycle of a document for RAG.
 *
 * Status transitions are strictly controlled to prevent invalid state changes
 * and ensure idempotent ingestion worker behaviour.
 */

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

/**
 * RAG document record stored in Firestore at:
 * /knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}
 */
export interface RagDocumentRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly displayName: string;
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  readonly statusMessage?: string;
  readonly checksum?: string;
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  readonly language?: string;
  readonly accessControl?: readonly string[];
  readonly versionGroupId: string;
  readonly versionNumber: number;
  readonly isLatest: boolean;
  readonly updateLog?: string;
  readonly accountId: string;
  readonly chunkCount?: number;
  readonly indexedAtISO?: string;
  readonly expiresAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
