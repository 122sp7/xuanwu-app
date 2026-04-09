/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article verification use cases ??verify and request review.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { Article } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import { VerifyArticleSchema, RequestArticleReviewSchema } from "../dto/ArticleDto";

export class VerifyArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult> {
    const parsed = VerifyArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.verify(parsed.data.verifiedByUserId, parsed.data.expiresAtISO);
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}

export class RequestArticleReviewUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult> {
    const parsed = RequestArticleReviewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.requestReview();
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}
