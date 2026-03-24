/**
 * Module: content
 * Layer: domain/entity
 * Purpose: Block entity — the atomic content unit inside a Page.
 */

import type { BlockContent } from "../value-objects/block-content";

export interface ContentBlock {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface AddContentBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly index?: number;
}

export interface UpdateContentBlockInput {
  readonly accountId: string;
  readonly blockId: string;
  readonly content: BlockContent;
}

export interface DeleteContentBlockInput {
  readonly accountId: string;
  readonly blockId: string;
}
