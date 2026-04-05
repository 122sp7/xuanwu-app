/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: KnowledgeCollection — a named grouping / database-view of KnowledgePages.
 *
 * A Collection is the "Notion Database" equivalent: it holds a set of page IDs
 * and an ordered schema of columns that define how those pages are displayed
 * as a structured table or board.
 *
 * Lifecycle:
 *   active → archived
 */

// ── Column (schema field) ─────────────────────────────────────────────────────

export type CollectionColumnType =
  | "text"
  | "number"
  | "select"
  | "multi-select"
  | "date"
  | "checkbox"
  | "url"
  | "relation";

export interface CollectionColumn {
  readonly id: string;
  readonly name: string;
  readonly type: CollectionColumnType;
  /** Options for select / multi-select columns */
  readonly options?: readonly string[];
}

// ── Aggregate Root ────────────────────────────────────────────────────────────

export type CollectionStatus = "active" | "archived";
/**
 * "database" = Notion-style Database (table / board / gallery with column schema).
 * "wiki"     = Knowledge Base space — pages carry verification + ownership metadata.
 */
export type CollectionSpaceType = "database" | "wiki";

export interface KnowledgeCollection {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  /** Ordered list of column schema definitions */
  readonly columns: readonly CollectionColumn[];
  /** IDs of KnowledgePages that belong to this collection */
  readonly pageIds: readonly string[];
  readonly status: CollectionStatus;
  /**
   * "database" = structured table/board with column schema (Notion Database).
   * "wiki"     = Knowledge Base space — enables page verification & ownership.
   */
  readonly spaceType: CollectionSpaceType;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Input types ───────────────────────────────────────────────────────────────

export interface CreateKnowledgeCollectionInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly description?: string;
  readonly columns?: readonly Omit<CollectionColumn, "id">[];
  readonly createdByUserId: string;
  /** Defaults to "database" if omitted. */
  readonly spaceType?: CollectionSpaceType;
}

export interface RenameKnowledgeCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly name: string;
}

export interface AddPageToCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly pageId: string;
}

export interface RemovePageFromCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly pageId: string;
}

export interface AddCollectionColumnInput {
  readonly accountId: string;
  readonly collectionId: string;
  readonly column: Omit<CollectionColumn, "id">;
}

export interface ArchiveKnowledgeCollectionInput {
  readonly accountId: string;
  readonly collectionId: string;
}
