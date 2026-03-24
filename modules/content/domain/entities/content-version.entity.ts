/**
 * Module: content
 * Layer: domain/entity
 * Purpose: Version entity — immutable snapshot of a page at a point in time.
 */

import type { BlockContent } from "../value-objects/block-content";

export interface ContentVersionBlock {
  readonly blockId: string;
  readonly order: number;
  readonly content: BlockContent;
}

export interface ContentVersion {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly label: string;
  readonly titleSnapshot: string;
  readonly blocks: readonly ContentVersionBlock[];
  readonly createdByUserId: string;
  readonly createdAtISO: string;
}

export interface CreateContentVersionInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly label?: string;
  readonly createdByUserId: string;
}
