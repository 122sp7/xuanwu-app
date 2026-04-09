// TODO: export getArticle, getArticlesByWorkspace, getCategoryTree

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/queries
 * Purpose: Direct-instantiation query functions (read-side).
 */

import { FirebaseArticleRepository } from "../../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import type { ArticleSnapshot, ArticleStatus } from "../../domain/aggregates/Article";
import type { CategorySnapshot } from "../../domain/aggregates/Category";

export async function getArticles(params: {
  accountId: string;
  workspaceId: string;
  categoryId?: string;
  status?: ArticleStatus;
}): Promise<ArticleSnapshot[]> {
  return new FirebaseArticleRepository().list(params);
}

export async function getArticle(accountId: string, articleId: string): Promise<ArticleSnapshot | null> {
  return new FirebaseArticleRepository().getById(accountId, articleId);
}

export async function getCategories(accountId: string, workspaceId: string): Promise<CategorySnapshot[]> {
  return new FirebaseCategoryRepository().listByWorkspace(accountId, workspaceId);
}

export async function getBacklinks(accountId: string, articleId: string): Promise<ArticleSnapshot[]> {
  return new FirebaseArticleRepository().listByLinkedArticleId(accountId, articleId);
}
