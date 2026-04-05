/**
 * Module: knowledge-base
 * Layer: interfaces/queries
 * Direct-instantiation query functions (read-side).
 */

import { FirebaseArticleRepository } from "../../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import type { Article, ArticleStatus } from "../../domain/entities/article.entity";
import type { Category } from "../../domain/entities/category.entity";

export async function getArticles(params: {
  accountId: string;
  workspaceId: string;
  categoryId?: string;
  status?: ArticleStatus;
}): Promise<Article[]> {
  const repo = new FirebaseArticleRepository();
  return repo.list(params);
}

export async function getArticle(accountId: string, articleId: string): Promise<Article | null> {
  const repo = new FirebaseArticleRepository();
  return repo.getArticleById(accountId, articleId);
}

export async function getCategories(accountId: string, workspaceId: string): Promise<Category[]> {
  const repo = new FirebaseCategoryRepository().withAccountId(accountId);
  return repo.listByWorkspace(workspaceId, accountId);
}
