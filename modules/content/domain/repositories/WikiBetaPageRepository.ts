/**
 * Module: content
 * Layer: domain/repositories
 * Purpose: Repository port for the WikiBeta page entity.
 */

import type { WikiBetaPage } from "../entities/wiki-beta-page.types";

export interface WikiBetaPageRepository {
  listByAccountId(accountId: string): Promise<WikiBetaPage[]>;
  findById(accountId: string, pageId: string): Promise<WikiBetaPage | null>;
  create(page: WikiBetaPage): Promise<void>;
  update(page: WikiBetaPage): Promise<void>;
}
