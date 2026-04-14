/**
 * JobDocument — value-like entity representing a source document
 * submitted for RAG pipeline processing.
 *
 * Immutable snapshot attached to an BackgroundJob; updated only when the
 * underlying source file metadata changes (e.g. title rename, MIME reclassification).
 */

export interface JobDocument {
  readonly id: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly sourceFileId: string;
  readonly title: string;
  readonly mimeType: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}
