import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
  PublishArticleUseCase,
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../../subdomains/authoring/application/use-cases";
import type { ArticleRepository } from "../../../subdomains/authoring/domain/repositories/ArticleRepository";
import type { CategoryRepository } from "../../../subdomains/authoring/domain/repositories/CategoryRepository";
import { makeArticleRepo, makeCategoryRepo } from "./repositories";

export interface AuthoringUseCases {
  readonly createArticle: CreateArticleUseCase;
  readonly updateArticle: UpdateArticleUseCase;
  readonly archiveArticle: ArchiveArticleUseCase;
  readonly deleteArticle: DeleteArticleUseCase;
  readonly publishArticle: PublishArticleUseCase;
  readonly verifyArticle: VerifyArticleUseCase;
  readonly requestArticleReview: RequestArticleReviewUseCase;
  readonly createCategory: CreateCategoryUseCase;
  readonly renameCategory: RenameCategoryUseCase;
  readonly moveCategory: MoveCategoryUseCase;
  readonly deleteCategory: DeleteCategoryUseCase;
}

export function makeAuthoringUseCases(
  articleRepo: ArticleRepository = makeArticleRepo(),
  categoryRepo: CategoryRepository = makeCategoryRepo(),
): AuthoringUseCases {
  return {
    createArticle: new CreateArticleUseCase(articleRepo),
    updateArticle: new UpdateArticleUseCase(articleRepo),
    archiveArticle: new ArchiveArticleUseCase(articleRepo),
    deleteArticle: new DeleteArticleUseCase(articleRepo),
    publishArticle: new PublishArticleUseCase(articleRepo),
    verifyArticle: new VerifyArticleUseCase(articleRepo),
    requestArticleReview: new RequestArticleReviewUseCase(articleRepo),
    createCategory: new CreateCategoryUseCase(categoryRepo),
    renameCategory: new RenameCategoryUseCase(categoryRepo),
    moveCategory: new MoveCategoryUseCase(categoryRepo),
    deleteCategory: new DeleteCategoryUseCase(categoryRepo),
  };
}
