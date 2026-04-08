import type { Article, ArticleStatus } from "../entities/article.entity";

export interface IArticleRepository {
  getById(articleId: string): Promise<Article>;
  list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
    cursor?: string;
  }): Promise<Article[]>;
  search(params: { workspaceId: string; query: string; limit?: number }): Promise<Article[]>;
  save(article: Article): Promise<void>;
  getByIds(articleIds: string[]): Promise<Article[]>;
  findByLinkedArticleId(articleId: string): Promise<Article[]>;
  delete(accountId: string, articleId: string): Promise<void>;
}
