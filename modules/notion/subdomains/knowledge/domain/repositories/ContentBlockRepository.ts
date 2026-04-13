/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/repositories
 * Purpose: Port interface for ContentBlock persistence.
 */

import type { ContentBlock } from "../aggregates/ContentBlock";

export interface ContentBlockRepository {
  save(block: ContentBlock): Promise<void>;
  findById(accountId: string, blockId: string): Promise<ContentBlock | null>;
  listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]>;
  delete(accountId: string, blockId: string): Promise<void>;
  countByPageId(accountId: string, pageId: string): Promise<number>;
}
