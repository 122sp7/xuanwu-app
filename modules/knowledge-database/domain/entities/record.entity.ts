export interface DatabaseRecord {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  /**
   * ID of the KnowledgePage that backs this record as a full-page document.
   * Null = record-only (no associated page body).
   * Set when a record is opened as a full page, creating a unified Page ↔ Record identity.
   */
  pageId: string | null;
  properties: Map<string, unknown>;
  order: number;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
