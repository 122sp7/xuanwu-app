"use server";

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { FirebaseArticleRepository } from "../../infrastructure/firebase/FirebaseArticleRepository";
import { FirebaseCategoryRepository } from "../../infrastructure/firebase/FirebaseCategoryRepository";
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  PublishArticleUseCase,
  ArchiveArticleUseCase,
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
  DeleteArticleUseCase,
} from "../../application/use-cases/article.use-cases";
import {
  CreateCategoryUseCase,
  RenameCategoryUseCase,
  MoveCategoryUseCase,
  DeleteCategoryUseCase,
} from "../../application/use-cases/category.use-cases";
import type { z } from "@lib-zod";
import type {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  CreateCategorySchema,
  RenameCategorySchema,
  MoveCategorySchema,
} from "../../application/dto/knowledge-base.dto";

function makeArticleRepo() { return new FirebaseArticleRepository(); }
function makeCategoryRepo(accountId: string) {
  return new FirebaseCategoryRepository().withAccountId(accountId);
}

export async function createArticle(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult> {
  try {
    return await new CreateArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function updateArticle(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult> {
  try {
    return await new UpdateArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_UPDATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function publishArticle(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult> {
  try {
    return await new PublishArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_PUBLISH_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function archiveArticle(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult> {
  try {
    return await new ArchiveArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_ARCHIVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function verifyArticle(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult> {
  try {
    return await new VerifyArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_VERIFY_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function requestArticleReview(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult> {
  try {
    return await new RequestArticleReviewUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_REVIEW_REQUEST_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteArticle(accountId: string, articleId: string): Promise<CommandResult> {
  try {
    const repo = makeArticleRepo() as FirebaseArticleRepository;
    await repo.deleteArticle(accountId, articleId);
    return commandSuccess(articleId, 1);
  } catch (e) {
    return commandFailureFrom("ARTICLE_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function createCategory(input: z.infer<typeof CreateCategorySchema>): Promise<CommandResult> {
  try {
    return await new CreateCategoryUseCase(makeCategoryRepo(input.accountId)).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_CREATE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function renameCategory(input: z.infer<typeof RenameCategorySchema>): Promise<CommandResult> {
  try {
    return await new RenameCategoryUseCase(makeCategoryRepo(input.accountId)).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_RENAME_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function moveCategory(input: z.infer<typeof MoveCategorySchema>): Promise<CommandResult> {
  try {
    return await new MoveCategoryUseCase(makeCategoryRepo(input.accountId)).execute(input);
  } catch (e) {
    return commandFailureFrom("CATEGORY_MOVE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteCategory(accountId: string, categoryId: string): Promise<CommandResult> {
  try {
    await makeCategoryRepo(accountId).delete(categoryId);
    return commandSuccess(categoryId, 1);
  } catch (e) {
    return commandFailureFrom("CATEGORY_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
