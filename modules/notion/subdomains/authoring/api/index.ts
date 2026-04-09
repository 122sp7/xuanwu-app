/**
 * Module: notion/subdomains/authoring
 * Layer: api (public boundary)
 * Purpose: Exposes only what external consumers need.
 *          All cross-module access must go through this file only.
 */

// ─── Read contracts ────────────────────────────────────────────────────────────
export type { ArticleSnapshot, ArticleStatus, ArticleVerificationState } from "../domain/aggregates/Article";
export type { CategorySnapshot } from "../domain/aggregates/Category";

// ─── Identifiers used by other BCs ────────────────────────────────────────────
export type ArticleId = string;
export type CategoryId = string;

// ─── Server Actions (write-side) ──────────────────────────────────────────────
export {
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
  deleteArticle,
} from "../interfaces/_actions/article.actions";

export {
  createCategory,
  renameCategory,
  moveCategory,
  deleteCategory,
} from "../interfaces/_actions/category.actions";

// ─── Queries (read-side) ──────────────────────────────────────────────────────
export { getArticles, getArticle, getCategories, getBacklinks } from "../interfaces/queries/index";

// ─── UI Components ────────────────────────────────────────────────────────────
export { ArticleDialog } from "../interfaces/components/ArticleDialog";

// TODO: export server actions (createArticle, publishArticle, archiveArticle, ...)
// TODO: export queries (getArticle, getArticlesByWorkspace, getCategoryTree)
// TODO: export UI components (ArticleEditorView, ArticleListView, CategoryTreeView)

export {};
