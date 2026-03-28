/**
 * Module: content
 * Layer: domain/repositories
 * Purpose: Repository port for the Wiki page entity.
 */

import type { WikiPage } from "../entities/wiki-page.types";

export interface WikiPageRepository {
  listByAccountId(accountId: string): Promise<WikiPage[]>;
  findById(accountId: string, pageId: string): Promise<WikiPage | null>;
  create(page: WikiPage): Promise<void>;
  update(page: WikiPage): Promise<void>;
}
