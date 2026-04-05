/**
 * Module: knowledge-base
 * Layer: application/use-cases
 * Article lifecycle use cases.
 */

import { z } from "@lib-zod";
import type { CommandResult } from "@shared-types";
import { commandFailureFrom, commandSuccess } from "@/modules/shared/api";
import type { IArticleRepository } from "../../domain/repositories/ArticleRepository";
import type { Article } from "../../domain/entities/article.entity";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  PublishArticleSchema,
  ArchiveArticleSchema,
  VerifyArticleSchema,
  RequestArticleReviewSchema,
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
    return commandSuccess(article.id, now);
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
    return commandSuccess(updated.id, now);
  }
}

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
    return commandSuccess(parsed.data.id, now);
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
    return commandSuccess(parsed.data.id, now);
  }
}

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
    return commandSuccess(parsed.data.id, now);
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
    return commandSuccess(parsed.data.id, now);
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
    await this.repo.delete(parsed.data.id);
    return commandSuccess(parsed.data.id, new Date().toISOString());
  }
}

export class ListArticlesUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(params: { workspaceId: string; accountId: string; categoryId?: string }) {
    return this.repo.list(params);
  }
}
