/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Purpose: Barrel re-export for all article use cases.
 *          Split by business process for IDDD single-responsibility:
 *  - article-lifecycle.use-cases.ts   (create, update, archive, delete, list)
 *  - article-publication.use-cases.ts (publish)
 *  - article-verification.use-cases.ts (verify, requestReview)
 */

export {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
  ListArticlesUseCase,
} from "./article-lifecycle.use-cases";

export { PublishArticleUseCase } from "./article-publication.use-cases";

export {
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
} from "./article-verification.use-cases";

