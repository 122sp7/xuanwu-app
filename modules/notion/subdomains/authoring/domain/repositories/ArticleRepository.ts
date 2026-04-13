/**
 * Module: notion/subdomains/authoring
 * Layer: domain/repositories
 * Purpose: Article persistence contract (driven port).
 */

import type { ArticleSnapshot, ArticleStatus } from "../aggregates/Article";

export interface ArticleRepository {
  getById(accountId: string, articleId: string): Promise<ArticleSnapshot | null>;
  list(params: {
    accountId: string;
    workspaceId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
  }): Promise<ArticleSnapshot[]>;
  listByLinkedArticleId(accountId: string, articleId: string): Promise<ArticleSnapshot[]>;
  save(snapshot: ArticleSnapshot): Promise<void>;
  delete(accountId: string, articleId: string): Promise<void>;
}
