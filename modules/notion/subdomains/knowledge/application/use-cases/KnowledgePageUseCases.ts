/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page lifecycle use cases — create, rename, move, archive, reorder.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import { KnowledgePage } from "../../domain/aggregates/KnowledgePage";
import type { IKnowledgePageRepository } from "../../domain/repositories/IKnowledgePageRepository";
import {
  CreateKnowledgePageSchema,
  type CreateKnowledgePageDto,
  RenameKnowledgePageSchema,
  type RenameKnowledgePageDto,
  MoveKnowledgePageSchema,
  type MoveKnowledgePageDto,
  ArchiveKnowledgePageSchema,
  type ArchiveKnowledgePageDto,
  ReorderKnowledgePageBlocksSchema,
  type ReorderKnowledgePageBlocksDto,
} from "../dto/KnowledgePageDto";

// Re-export read queries for backward compatibility
export {
  buildKnowledgePageTree,
  GetKnowledgePageUseCase,
  ListKnowledgePagesUseCase,
  ListKnowledgePagesByWorkspaceUseCase,
  GetKnowledgePageTreeUseCase,
  GetKnowledgePageTreeByWorkspaceUseCase,
} from "../queries/knowledge-page.queries";

export class CreateKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: CreateKnowledgePageDto): Promise<CommandResult> {
    const parsed = CreateKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, workspaceId, title, parentPageId, createdByUserId } = parsed.data;
    const order = await this.repo.countByParent(accountId, parentPageId ?? null);
    const id = generateId();
    const page = KnowledgePage.create(id, {
      accountId,
      workspaceId,
      title: title.trim(),
      parentPageId: parentPageId ?? null,
      createdByUserId,
      order,
    });
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class RenameKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: RenameKnowledgePageDto): Promise<CommandResult> {
    const parsed = RenameKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, title } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.rename(title.trim());
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class MoveKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: MoveKnowledgePageDto): Promise<CommandResult> {
    const parsed = MoveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, targetParentPageId } = parsed.data;
    if (pageId === targetParentPageId) {
      return commandFailureFrom("CONTENT_PAGE_CIRCULAR_MOVE", "A page cannot be its own parent.");
    }
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.move(targetParentPageId);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class ArchiveKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.archive();
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}

export class ReorderKnowledgePageBlocksUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
    const parsed = ReorderKnowledgePageBlocksSchema.safeParse(input);
    if (!parsed.success) return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);

    const { accountId, pageId, blockIds } = parsed.data;
    const page = await this.repo.findById(accountId, pageId);
    if (!page) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    page.reorderBlocks(blockIds);
    await this.repo.save(page);
    return commandSuccess(page.id, Date.now());
  }
}
