/**
 * knowledge-base public API boundary
 *
 * Other modules MUST import knowledge-base resources from this file only.
 * Never import from domain/, application/, or infrastructure/ directly.
 */

// ─── Read contracts ────────────────────────────────────────────────────────────
export type { Article, ArticleStatus, VerificationState } from "../domain/entities/article.entity";
export type { Category } from "../domain/entities/category.entity";

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
  createCategory,
  renameCategory,
  moveCategory,
  deleteCategory,
} from "../interfaces/_actions/knowledge-base.actions";

// ─── Queries (read-side) ──────────────────────────────────────────────────────
export {
  getArticles,
  getArticle,
  getCategories,
  getBacklinks,
} from "../interfaces/queries/knowledge-base.queries";

// ─── UI Components ────────────────────────────────────────────────────────────
export { ArticleDialog } from "../interfaces/components/ArticleDialog";
