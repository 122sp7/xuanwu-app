/**
 * Module: notion/subdomains/database
 * Layer: domain/aggregates
 * Purpose: DatabaseRecord aggregate — a single row in a Database, optionally linked to a page.
 */

export interface DatabaseRecordSnapshot {
  id: string;
  databaseId: string;
  workspaceId: string;
  accountId: string;
  /** Links this record to a KnowledgePage (Article-Record identity pattern). */
  pageId: string | null;
  properties: Record<string, unknown>;
  order: number;
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}

export type RecordId = string;
