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
 *
 * Fields align with knowledge.md §2.1 (files collection spec).
 */
export interface RagDocumentRecord {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  /** User-visible file name (preserves original filename semantics). */
  readonly displayName: string;
  /** System / legacy title (same as displayName for initial uploads). */
  readonly title: string;
  readonly sourceFileName: string;
  readonly mimeType: string;
  readonly storagePath: string;
  readonly sizeBytes: number;
  readonly status: RagDocumentStatus;
  /** Error detail written back when status is "failed". */
  readonly statusMessage?: string;
  readonly checksum?: string;
  /** Semantic document taxonomy / category hierarchy (e.g. "規章制度"). */
  readonly taxonomy?: string;
  readonly category?: string;
  readonly department?: string;
  readonly tags?: readonly string[];
  /** Primary language of the document content (ISO 639-1, e.g. "zh-TW"). */
  readonly language?: string;
  /** Allowed OrganizationRole values or accountId allowlist for RBAC. */
  readonly accessControl?: readonly string[];
  /**
   * Version group identifier — all versions of the same logical document share
   * this ID.  Defaults to the document's own id for the first upload.
   */
  readonly versionGroupId: string;
  /** 1-based version counter within the versionGroupId. */
  readonly versionNumber: number;
  /** True when this record is the current canonical version for its group. */
  readonly isLatest: boolean;
  /** Free-text description of what changed in this version. */
  readonly updateLog?: string;
  /** Account ID of the person who uploaded this document. */
  readonly accountId: string;
  /** Total chunk count — written back by the ingestion worker after processing. */
  readonly chunkCount?: number;
  /** ISO-8601 timestamp set by the ingestion worker when indexing completes. */
  readonly indexedAtISO?: string;
  /** ISO-8601 expiry timestamp; the document is auto-archived when reached. */
  readonly expiresAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface RagDocumentRepository {
  findByStoragePath(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly storagePath: string;
  }): Promise<RagDocumentRecord | null>;
  findByWorkspace(scope: {
    readonly organizationId: string;
    readonly workspaceId: string;
  }): Promise<readonly RagDocumentRecord[]>;
  saveUploaded(record: RagDocumentRecord): Promise<void>;
}
