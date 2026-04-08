/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Purpose: Article publication use cases — publish.
 * Lifecycle: see article-lifecycle.use-cases.ts
 * Verification: see article-verification.use-cases.ts
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import { PublishArticleSchema } from "../dto/knowledge-base.dto";

export class PublishArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof PublishArticleSchema>): Promise<CommandResult> {
    const parsed = PublishArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const now = new Date().toISOString();
    await this.repo.save({ ...existing, status: "published", version: existing.version + 1, updatedAtISO: now });
    return commandSuccess(parsed.data.id, existing.version + 1);
  }
}
