/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Version entity — immutable snapshot of a page at a point in time.
 *
 * A Version captures the state of a Page (title + ordered block IDs + full
 * block contents) so that users can view history and restore past states.
 *
 * Versions are append-only and read-only after creation (event-sourcing style).
 */

import type { BlockContent } from "../value-objects/block-content";

// ── Version entity ────────────────────────────────────────────────────────────

/**
 * A single block snapshot captured at version time.
 * BlockContent is inlined so that the snapshot is fully self-contained.
 */
export interface KnowledgeVersionBlock {
  readonly blockId: string;
  readonly order: number;
  readonly content: BlockContent;
}

/**
 * Immutable historical snapshot of a Page.
 * Once created, a Version is never modified.
 */
export interface KnowledgeVersion {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  /** Human-readable label (e.g. "Published", "Auto-save", or user-supplied). */
  readonly label: string;
  /** Full page title at the time of versioning. */
  readonly titleSnapshot: string;
  /** Ordered block snapshots as they existed when this version was captured. */
  readonly blocks: readonly KnowledgeVersionBlock[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateKnowledgeVersionInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly label?: string;
  readonly createdByUserId: string;
}
