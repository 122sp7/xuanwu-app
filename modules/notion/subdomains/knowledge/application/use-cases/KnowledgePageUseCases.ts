/**
 * Module: notion/subdomains/knowledge
 * Layer: application/use-cases
 * Purpose: Page lifecycle use cases — create, rename, move, archive, reorder.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import { v7 as generateId } from "@lib-uuid";

import { KnowledgePage } from "../../domain/aggregates/KnowledgePage";
import type { KnowledgePageSnapshot, KnowledgePageTreeNode } from "../../domain/aggregates/KnowledgePage";
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

export function buildKnowledgePageTree(pages: KnowledgePageSnapshot[]): KnowledgePageTreeNode[] {
  const map = new Map<string, KnowledgePageTreeNode>();
  for (const page of pages) {
    map.set(page.id, { ...page, children: [] });
  }
  const roots: KnowledgePageTreeNode[] = [];
  for (const node of map.values()) {
    if (node.parentPageId === null || !map.has(node.parentPageId)) {
      roots.push(node);
    } else {
      const parent = map.get(node.parentPageId)!;
      (parent.children as KnowledgePageTreeNode[]).push(node);
    }
  }
  const sortByOrder = (nodes: KnowledgePageTreeNode[]): void => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortByOrder(n.children as KnowledgePageTreeNode[]);
  };
  sortByOrder(roots);
  return roots;
}

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

export class GetKnowledgePageUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgePageSnapshot | null> {
    if (!accountId.trim() || !pageId.trim()) return null;
    return this.repo.findSnapshotById(accountId, pageId);
  }
}

export class ListKnowledgePagesUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageSnapshot[]> {
    if (!accountId.trim()) return [];
    return this.repo.listSnapshotsByAccountId(accountId);
  }
}

export class ListKnowledgePagesByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgePageSnapshot[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    return this.repo.listSnapshotsByWorkspaceId(accountId, workspaceId);
  }
}

export class GetKnowledgePageTreeUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim()) return [];
    const pages = await this.repo.listSnapshotsByAccountId(accountId);
    return buildKnowledgePageTree(pages);
  }
}

export class GetKnowledgePageTreeByWorkspaceUseCase {
  constructor(private readonly repo: IKnowledgePageRepository) {}

  async execute(accountId: string, workspaceId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim() || !workspaceId.trim()) return [];
    const pages = await this.repo.listSnapshotsByWorkspaceId(accountId, workspaceId);
    return buildKnowledgePageTree(pages);
  }
}
