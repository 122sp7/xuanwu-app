// TODO: export getArticle, getArticlesByWorkspace, getCategoryTree

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/queries
 * Purpose: Direct-instantiation query functions (read-side).
 */

import { makeArticleRepo, makeCategoryRepo } from "../../../subdomains/authoring/api/factories";
import type { ArticleSnapshot, ArticleStatus } from "../../../subdomains/authoring/application/dto/authoring.dto";
import type { CategorySnapshot } from "../../../subdomains/authoring/application/dto/authoring.dto";

export async function getArticles(params: {
  accountId: string;
  workspaceId: string;
  categoryId?: string;
  status?: ArticleStatus;
}): Promise<ArticleSnapshot[]> {
  return makeArticleRepo().list(params);
}

export async function getArticle(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
  return makeArticleRepo().getById(accountId, articleId);
}

export async function getCategories(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
  return makeCategoryRepo().listByWorkspace(accountId, workspaceId);
}

export async function getBacklinks(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
  return makeArticleRepo().listByLinkedArticleId(accountId, articleId);
}
