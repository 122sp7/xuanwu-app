/**
 * Module: content
 * Layer: application/use-cases
 * Purpose: Page use cases — create, rename, move, reorder blocks, archive, list.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { ContentPage, ContentPageTreeNode } from "../../domain/entities/content-page.entity";
import type { ContentPageRepository } from "../../domain/repositories/content.repositories";
import {
  CreateContentPageSchema,
  type CreateContentPageDto,
  RenameContentPageSchema,
  type RenameContentPageDto,
  MoveContentPageSchema,
  type MoveContentPageDto,
  ArchiveContentPageSchema,
  type ArchiveContentPageDto,
  ReorderContentPageBlocksSchema,
  type ReorderContentPageBlocksDto,
} from "../dto/content.dto";

export function buildContentPageTree(pages: ContentPage[]): ContentPageTreeNode[] {
  const map = new Map<string, ContentPageTreeNode>();
  for (const page of pages) {
    map.set(page.id, { ...page, children: [] });
  }

  const roots: ContentPageTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentPageId === null || !map.has(node.parentPageId)) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentPageId)!;
      (parent.children as ContentPageTreeNode[]).push(node);
    }
  }

  const sortByOrder = (nodes: ContentPageTreeNode[]): void => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortByOrder(n.children as ContentPageTreeNode[]);
  };
  sortByOrder(roots);

  return roots;
}

export class CreateContentPageUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(input: CreateContentPageDto): Promise<CommandResult> {
    const parsed = CreateContentPageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, workspaceId, title, parentPageId, createdByUserId } = parsed.data;

    const page = await this.repo.create({
      accountId,
      workspaceId,
      title: title.trim(),
      parentPageId: parentPageId ?? null,
      createdByUserId,
    });

    return commandSuccess(page.id, Date.now());
  }
}

export class RenameContentPageUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(input: RenameContentPageDto): Promise<CommandResult> {
    const parsed = RenameContentPageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, title } = parsed.data;
    const updated = await this.repo.rename({ accountId, pageId, title: title.trim() });
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class MoveContentPageUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(input: MoveContentPageDto): Promise<CommandResult> {
    const parsed = MoveContentPageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, targetParentPageId } = parsed.data;

    if (pageId === targetParentPageId) {
      return commandFailureFrom("CONTENT_PAGE_CIRCULAR_MOVE", "A page cannot be its own parent.");
    }

    const updated = await this.repo.move({ accountId, pageId, targetParentPageId });
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ArchiveContentPageUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(input: ArchiveContentPageDto): Promise<CommandResult> {
    const parsed = ArchiveContentPageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId } = parsed.data;
    const updated = await this.repo.archive(accountId, pageId);
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ReorderContentPageBlocksUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(input: ReorderContentPageBlocksDto): Promise<CommandResult> {
    const parsed = ReorderContentPageBlocksSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, blockIds } = parsed.data;
    const updated = await this.repo.reorderBlocks({ accountId, pageId, blockIds });
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class GetContentPageUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(accountId: string, pageId: string): Promise<ContentPage | null> {
    if (!accountId.trim() || !pageId.trim()) return null;
    return this.repo.findById(accountId, pageId);
  }
}

export class ListContentPagesUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(accountId: string): Promise<ContentPage[]> {
    if (!accountId.trim()) return [];
    return this.repo.listByAccountId(accountId);
  }
}

export class GetContentPageTreeUseCase {
  constructor(private readonly repo: ContentPageRepository) {}

  async execute(accountId: string): Promise<ContentPageTreeNode[]> {
    if (!accountId.trim()) return [];
    const pages = await this.repo.listByAccountId(accountId);
    return buildContentPageTree(pages);
  }
}
