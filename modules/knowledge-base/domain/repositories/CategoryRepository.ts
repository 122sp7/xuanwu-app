import type { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  getById(categoryId: string): Promise<Category>;
  listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]>;
  listChildren(parentCategoryId: string): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(categoryId: string): Promise<void>;
  updateArticleIds(categoryId: string, articleIds: string[]): Promise<void>;
}
