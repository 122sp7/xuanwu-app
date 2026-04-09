/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article publication use case.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { Article } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import { PublishArticleSchema } from "../dto/ArticleDto";

export class PublishArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult> {
    const parsed = PublishArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    try {
      article.publish();
    } catch (e) {
      return commandFailureFrom("ARTICLE_PUBLISH_REJECTED", e instanceof Error ? e.message : "Cannot publish");
    }
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, article.getSnapshot().version);
  }
}
