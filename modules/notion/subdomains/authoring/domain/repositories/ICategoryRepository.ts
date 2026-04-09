/**
 * Module: notion/subdomains/authoring
 * Layer: domain/repositories
 * Purpose: Category persistence contract (driven port).
 */

import type { CategorySnapshot } from "../aggregates/Category";

export interface ICategoryRepository {
  getById(accountId: string, categoryId: string): Promise<CategorySnapshot | null>;
  listByWorkspace(accountId: string, workspaceId: string): Promise<CategorySnapshot[]>;
  save(snapshot: CategorySnapshot): Promise<void>;
  delete(accountId: string, categoryId: string): Promise<void>;
}
