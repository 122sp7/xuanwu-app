/**
 * Module: notion/subdomains/authoring
 * Layer: application/use-cases
 * Purpose: Article lifecycle use cases — create, update, archive, delete.
 */

import type { z } from "@lib-zod";
import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";
import { Article } from "../../domain/aggregates/Article";
import type { IArticleRepository } from "../../domain/repositories/IArticleRepository";
import {
  CreateArticleSchema,
  UpdateArticleSchema,
  ArchiveArticleSchema,
  DeleteArticleSchema,
} from "../dto/ArticleDto";

export class CreateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof CreateArticleSchema>): Promise<CommandResult> {
    const parsed = CreateArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const article = Article.create(generateId(), {
      accountId: parsed.data.accountId,
      workspaceId: parsed.data.workspaceId,
      categoryId: parsed.data.categoryId,
      title: parsed.data.title,
      content: parsed.data.content,
      tags: parsed.data.tags,
      createdByUserId: parsed.data.createdByUserId,
    });
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id, 1);
  }
}

export class UpdateArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof UpdateArticleSchema>): Promise<CommandResult> {
    const parsed = UpdateArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.update({
      title: parsed.data.title,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId,
      tags: parsed.data.tags,
    });
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id);
  }
}

export class ArchiveArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof ArchiveArticleSchema>): Promise<CommandResult> {
    const parsed = ArchiveArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const snapshot = await this.repo.getById(parsed.data.accountId, parsed.data.id);
    if (!snapshot) return commandFailureFrom("ARTICLE_NOT_FOUND", "Article not found");
    const article = Article.reconstitute(snapshot);
    article.archive();
    await this.repo.save(article.getSnapshot());
    return commandSuccess(article.id);
  }
}

export class DeleteArticleUseCase {
  constructor(private readonly repo: IArticleRepository) {}

  async execute(input: z.infer<typeof DeleteArticleSchema>): Promise<CommandResult> {
    const parsed = DeleteArticleSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("ARTICLE_INVALID_INPUT", parsed.error.issues[0]?.message ?? "Invalid input");
    }
    await this.repo.delete(parsed.data.accountId, parsed.data.id);
    return commandSuccess(parsed.data.id);
  }
}
