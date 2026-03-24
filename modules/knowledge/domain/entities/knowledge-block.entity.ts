/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Block entity — the atomic content unit inside a Page.
 *
 * A Block represents a single piece of content: a paragraph, heading,
 * image, code snippet, list item, etc. Its life cycle is tied to the
 * Page aggregate: blocks are created/deleted only through the Page.
 *
 * The actual content is captured by the BlockContent value object.
 */

import type { BlockContent } from "../value-objects/block-content";

// ── Block entity ──────────────────────────────────────────────────────────────

export interface KnowledgeBlock {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  /** Typed, immutable content snapshot (value object). */
  readonly content: BlockContent;
  /** Relative sort position within the page (mirrored in Page.blockIds order). */
  readonly order: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface AddKnowledgeBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  /** Insert at this index; omit to append at end. */
  readonly index?: number;
}

export interface UpdateKnowledgeBlockInput {
  readonly accountId: string;
  readonly blockId: string;
  readonly content: BlockContent;
}

export interface DeleteKnowledgeBlockInput {
  readonly accountId: string;
  readonly blockId: string;
}
