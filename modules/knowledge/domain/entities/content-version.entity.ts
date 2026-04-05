/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Version entity — immutable snapshot of a page at a point in time.
 */

import type { BlockContent } from "../value-objects/block-content";

export interface KnowledgeVersionBlock {
  readonly blockId: string;
  readonly order: number;
  readonly content: BlockContent;
}

export interface KnowledgeVersion {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly label: string;
  readonly titleSnapshot: string;
  readonly blocks: readonly KnowledgeVersionBlock[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}

export interface CreateKnowledgeVersionInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly label?: string;
  readonly createdByUserId: string;
}
