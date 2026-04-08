/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Purpose: Article lifecycle use cases — create, update, archive, delete, list.
 * Publication: see article-publication.use-cases.ts
 * Verification: see article-verification.use-cases.ts
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import type { Article } from "../../domain/entities/article.entity";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  ArchiveArticleSchema,
  DeleteArticleSchema,
} from "../dto/knowledge-base.dto";
import { v7 as generateId } from "@lib-uuid";

export class CreateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult> {
    const parsed = CreateArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const now = new Date().toISOString();
    const article: Article = {
      id: generateId(),
      accountId: parsed.data.accountId,
      workspaceId: parsed.data.workspaceId,
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
      status: "draft",
      version: 1,
      verificationState: "unverified",
      ownerId: parsed.data.createdByUserId,
      verifiedByUserId: null,
      verifiedAtISO: null,
      verificationExpiresAtISO: null,
      linkedArticleIds: [],
      createdByUserId: parsed.data.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await this.repo.save(article);
    return commandSuccess(article.id, article.version);
  }
}

export class UpdateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult> {
    const parsed = UpdateArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const now = new Date().toISOString();
    const updated: Article = {
      ...existing,
      title: parsed.data.title ?? existing.title,
      content: parsed.data.content ?? existing.content,
      categoryId: parsed.data.categoryId !== undefined ? parsed.data.categoryId : existing.categoryId,
      tags: parsed.data.tags ?? existing.tags,
      updatedAtISO: now,
    };
    await this.repo.save(updated);
    return commandSuccess(updated.id, updated.version);
  }
}

export class ArchiveArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult> {
    const parsed = ArchiveArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const now = new Date().toISOString();
    await this.repo.save({ ...existing, status: "archived", updatedAtISO: now });
    return commandSuccess(parsed.data.id, existing.version);
  }
}

export class DeleteArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult> {
    const parsed = DeleteArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const existing = await this.repo.getById(parsed.data.id);
    if (!existing) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id, existing.version);
  }
}

export class ListArticlesUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(params: { workspaceId: string; accountId: string; categoryId?: string }) {
    return this.repo.list(params);
  }
}
