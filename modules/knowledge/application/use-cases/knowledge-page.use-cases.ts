/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Page use cases — create, rename, move, reorder blocks, archive, list.
 *
 * Each use case depends ONLY on the KnowledgePageRepository port (interface).
 * Pattern: constructor-injected repository → execute() → CommandResult.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/knowledge-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
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
} from "../dto/knowledge.dto";

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Converts a flat list of Pages into a nested tree.
 * Pages without a matching parent are attached to the root.
 */
export function buildKnowledgePageTree(pages: KnowledgePage[]): KnowledgePageTreeNode[] {
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

  // Sort each level by order ascending
  const sortByOrder = (nodes: KnowledgePageTreeNode[]): void => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortByOrder(n.children as KnowledgePageTreeNode[]);
  };
  sortByOrder(roots);

  return roots;
}

// ── Use Cases ─────────────────────────────────────────────────────────────────

export class CreateKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: CreateKnowledgePageDto): Promise<CommandResult> {
    const parsed = CreateKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_PAGE_INVALID_INPUT", parsed.error.message);
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

export class RenameKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: RenameKnowledgePageDto): Promise<CommandResult> {
    const parsed = RenameKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, title } = parsed.data;
    const updated = await this.repo.rename({ accountId, pageId, title: title.trim() });
    if (!updated) return commandFailureFrom("KNOWLEDGE_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class MoveKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: MoveKnowledgePageDto): Promise<CommandResult> {
    const parsed = MoveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, targetParentPageId } = parsed.data;

    // Guard: a page cannot be moved into itself
    if (pageId === targetParentPageId) {
      return commandFailureFrom("KNOWLEDGE_PAGE_CIRCULAR_MOVE", "A page cannot be its own parent.");
    }

    const updated = await this.repo.move({ accountId, pageId, targetParentPageId });
    if (!updated) return commandFailureFrom("KNOWLEDGE_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ArchiveKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId } = parsed.data;
    const updated = await this.repo.archive(accountId, pageId);
    if (!updated) return commandFailureFrom("KNOWLEDGE_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ReorderKnowledgePageBlocksUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
    const parsed = ReorderKnowledgePageBlocksSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("KNOWLEDGE_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, blockIds } = parsed.data;
    const updated = await this.repo.reorderBlocks({ accountId, pageId, blockIds });
    if (!updated) return commandFailureFrom("KNOWLEDGE_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class GetKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(accountId: string, pageId: string): Promise<KnowledgePage | null> {
    if (!accountId.trim() || !pageId.trim()) return null;
    return this.repo.findById(accountId, pageId);
  }
}

export class ListKnowledgePagesUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePage[]> {
    if (!accountId.trim()) return [];
    return this.repo.listByAccountId(accountId);
  }
}

export class GetKnowledgePageTreeUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(accountId: string): Promise<KnowledgePageTreeNode[]> {
    if (!accountId.trim()) return [];
    const pages = await this.repo.listByAccountId(accountId);
    return buildKnowledgePageTree(pages);
  }
}
