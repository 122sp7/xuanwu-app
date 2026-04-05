/**
 * knowledge-base module — public barrel export
 *
 * Cross-module access: only import from this file.
 * Internal layers (domain/, application/, infrastructure/) are NOT exported here.
 *
 * @module knowledge-base
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type { Article, ArticleStatus, VerificationState } from "./domain/entities/article.entity";
export type { Category } from "./domain/entities/category.entity";

// ─── Public API (cross-module use) ────────────────────────────────────────────
// Re-export from api/ for consumers who import the module barrel
export * from "./api";

// ─── TODO: Server Actions (write-side) ────────────────────────────────────────
// Uncomment when implemented:
// export { createArticle } from "./interfaces/_actions/article.actions";
// export { updateArticle } from "./interfaces/_actions/article.actions";
// export { publishArticle } from "./interfaces/_actions/article.actions";
// export { archiveArticle } from "./interfaces/_actions/article.actions";
// export { verifyArticle } from "./interfaces/_actions/article.actions";
// export { requestArticleReview } from "./interfaces/_actions/article.actions";
// export { createCategory } from "./interfaces/_actions/category.actions";
// export { moveCategory } from "./interfaces/_actions/category.actions";

// ─── TODO: Queries (read-side) ────────────────────────────────────────────────
// Uncomment when implemented:
// export { useArticle } from "./interfaces/queries/useArticle";
// export { useArticles } from "./interfaces/queries/useArticles";
// export { useCategories } from "./interfaces/queries/useCategories";
