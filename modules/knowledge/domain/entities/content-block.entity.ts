/**
 * Module: knowledge
 * Layer: domain/entity
 * Purpose: Block entity — the atomic content unit inside a Page.
 */

import type { BlockContent } from "../value-objects/block-content";

export interface KnowledgeBlock {
  readonly id: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
  readonly order: number;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface AddKnowledgeBlockInput {
  readonly pageId: string;
  readonly accountId: string;
  readonly content: BlockContent;
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
