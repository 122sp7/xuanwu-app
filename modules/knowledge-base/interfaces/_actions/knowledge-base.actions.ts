/**
 * Module: knowledge-base
 * Layer: interfaces/_actions
 * Purpose: Barrel re-export for all knowledge-base server actions.
 *          Split by aggregate for IDDD single-responsibility:
 *  - article.actions.ts   (Article aggregate)
 *  - category.actions.ts  (Category aggregate)
 */

export {
  createArticle,
  updateArticle,
  publishArticle,
  archiveArticle,
  verifyArticle,
  requestArticleReview,
  deleteArticle,
} from "./article.actions";

export {
  createCategory,
  renameCategory,
  moveCategory,
  deleteCategory,
} from "./category.actions";
