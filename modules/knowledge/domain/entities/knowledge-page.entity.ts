/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Page aggregate root — the central document unit in the Knowledge domain.
 *
 * A Page is the primary content container (like a Notion page or a wiki article).
 * It owns the ordered list of Block IDs and its position in the PageTree.
 *
 * Multi-tenant: every page is scoped to accountId + optional workspaceId.
 * Hierarchy: parentPageId forms the tree structure (null = root-level page).
 */

// ── Page status ───────────────────────────────────────────────────────────────

export type KnowledgePageStatus = "active" | "archived";

export const KNOWLEDGE_PAGE_STATUSES = ["active", "archived"] as const satisfies readonly KnowledgePageStatus[];

// ── Aggregate root: Page ──────────────────────────────────────────────────────

/**
 * Page aggregate root.
 * Owns: metadata, block order (blockIds), position in tree (parentPageId, order).
 */
export interface KnowledgePage {
  readonly id: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  /** Slugified identifier for URL routing (e.g. "my-page-title"). */
  readonly slug: string;
  /** null = root-level page; set = child of that page. */
  readonly parentPageId: string | null;
  /** Relative sort position within the parent (ascending). */
  readonly order: number;
  /** Ordered list of Block IDs that belong to this page. */
  readonly blockIds: readonly string[];
  readonly status: KnowledgePageStatus;
  readonly createdByUserId: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Tree node projection ──────────────────────────────────────────────────────

/**
 * A Page enriched with its resolved children — used for sidebar tree rendering.
 * This is a read-model projection, NOT part of the Page aggregate itself.
 */
export interface KnowledgePageTreeNode extends KnowledgePage {
  readonly children: readonly KnowledgePageTreeNode[];
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateKnowledgePageInput {
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly parentPageId?: string | null;
  readonly createdByUserId: string;
}

export interface RenameKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  readonly title: string;
}

export interface MoveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
  /** New parent; null = promote to root. */
  readonly targetParentPageId: string | null;
}

export interface ReorderKnowledgePageBlocksInput {
  readonly accountId: string;
  readonly pageId: string;
  /** Full replacement of the blockIds array (caller is responsible for completeness). */
  readonly blockIds: readonly string[];
}

export interface ArchiveKnowledgePageInput {
  readonly accountId: string;
  readonly pageId: string;
}
