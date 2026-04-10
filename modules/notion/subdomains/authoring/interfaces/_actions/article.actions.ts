"use server";

/**
 * Module: notion/subdomains/authoring
 * Layer: interfaces/_actions
 * Purpose: Article Server Actions — thin adapter over article use cases.
 */

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeArticleRepo } from "../../api/factories";
import {
  CreateArticleUseCase,
  UpdateArticleUseCase,
  ArchiveArticleUseCase,
  DeleteArticleUseCase,
} from "../../application/use-cases/ArticleLifecycleUseCases";
import { PublishArticleUseCase } from "../../application/use-cases/ArticlePublicationUseCases";
import {
  VerifyArticleUseCase,
  RequestArticleReviewUseCase,
} from "../../application/use-cases/ArticleVerificationUseCases";
import type { z } from "@lib-zod";
import type {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
  DeleteArticleSchema,
} from "../../application/dto/ArticleDto";

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

export async function requestArticleReview(
  input: z.infer<typeof RequestArticleReviewSchema>,
): Promise<CommandResult> {
  try {
    return await new RequestArticleReviewUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_REVIEW_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}

export async function deleteArticle(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult> {
  try {
    return await new DeleteArticleUseCase(makeArticleRepo()).execute(input);
  } catch (e) {
    return commandFailureFrom("ARTICLE_DELETE_FAILED", (e as Error)?.message ?? "Unknown error");
  }
}
