/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Block entity — the atomic content unit inside a Page.
 *
 * A Block is an AGGREGATE ROOT in its own right:
 *   - It has a stable identity (id).
 *   - It may have a parent block (parentBlockId) enabling toggle, callout, and
 *     other nested-block structures (Notion-compatible block tree).
 *   - childBlockIds tracks the ordered list of direct children.
 *   - Blocks with parentBlockId = null are top-level children of the Page.
 */

import type { BlockContent } from "../value-objects/block-content";

export interface KnowledgeBlock {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  /**
   * ID of the parent block, or null if this block is a direct child of the Page.
   * Enables nested block structures (toggle, callout, columns, etc.).
   */
  readonly parentBlockId: string | null;
  /**
   * Ordered list of child block IDs (direct children of this block).
   * Empty array for leaf blocks.
   */
  readonly childBlockIds: ReadonlyArray<string>;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface AddKnowledgeBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly index?: number;
  /** Parent block ID for nested insertion. Null/undefined = top-level. */
  readonly parentBlockId?: string | null;
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

export interface NestKnowledgeBlockInput {
  readonly accountId: string;
  /** The block to be nested (child). */
  readonly blockId: string;
  /** The block that will become the parent. */
  readonly parentBlockId: string;
  /** Position within the parent's childBlockIds. Defaults to last. */
  readonly index?: number;
}

export interface UnnestKnowledgeBlockInput {
  readonly accountId: string;
  /** The block to move back to page-level (remove from parent). */
  readonly blockId: string;
  /** Target position at page-level. Defaults to last. */
  readonly index?: number;
}
