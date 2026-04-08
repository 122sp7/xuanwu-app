/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Purpose: Article verification use cases — verify, request review.
 * Lifecycle: see article-lifecycle.use-cases.ts
 * Publication: see article-publication.use-cases.ts
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import { VerifyArticleSchema, RequestArticleReviewSchema } from "../dto/knowledge-base.dto";

export class VerifyArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof VerifyArticleSchema>): Promise<CommandResult> {
    const parsed = VerifyArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const now = new Date().toISOString();
    const expiresAt = parsed.data.expiresInDays
      ? new Date(Date.now() + parsed.data.expiresInDays * 86400000).toISOString()
      : null;
    await this.repo.save({
      ...existing,
      verificationState: "verified",
      verifiedByUserId: parsed.data.verifiedByUserId,
      verifiedAtISO: now,
      verificationExpiresAtISO: expiresAt,
      updatedAtISO: now,
    });
    return commandSuccess(parsed.data.id, existing.version);
  }
}

export class RequestArticleReviewUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof RequestArticleReviewSchema>): Promise<CommandResult> {
    const parsed = RequestArticleReviewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const now = new Date().toISOString();
    await this.repo.save({ ...existing, verificationState: "needs_review", updatedAtISO: now });
    return commandSuccess(parsed.data.id, existing.version);
  }
}
