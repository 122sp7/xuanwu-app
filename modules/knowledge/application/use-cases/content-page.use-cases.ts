/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Page use cases — create, rename, move, reorder blocks, archive, list.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { ContentPage, ContentPageTreeNode } from "../../domain/entities/content-page.entity";
import type { ContentPageRepository } from "../../domain/repositories/content.repositories";
import {
  PublishDomainEventUseCase,
  type IEventStoreRepository,
  type IEventBusRepository,
} from "@/modules/shared/api";
import { v7 as generateId } from "@lib-uuid";
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
  ApproveContentPageSchema,
  type ApproveContentPageDto,
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

export class ApproveContentPageUseCase {
  constructor(
    private readonly repo: ContentPageRepository,
    private readonly eventStore: IEventStoreRepository,
    private readonly eventBus: IEventBusRepository,
  ) {}

  async execute(input: ApproveContentPageDto): Promise<CommandResult> {
    const parsed = ApproveContentPageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const {
      accountId,
      pageId,
      actorId,
      causationId: inputCausationId,
      extractedTasks,
      extractedInvoices,
      correlationId: inputCorrelationId,
      workspaceId,
    } = parsed.data;

    // causationId is set by the Server Action layer; generateId() is a safe fallback.
    const causationId = inputCausationId ?? generateId();

    const page = await this.repo.findById(accountId, pageId);
    if (!page) {
      return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    }
    if (page.status === "archived") {
      return commandFailureFrom("CONTENT_PAGE_ARCHIVED", "Cannot approve an archived page.");
    }
    if (page.approvalState === "approved") {
      return commandFailureFrom("CONTENT_PAGE_ALREADY_APPROVED", "Page is already approved.");
    }

    const nowISO = new Date().toISOString();
    const approved = await this.repo.approve({ accountId, pageId, approvedByUserId: actorId, approvedAtISO: nowISO });
    if (!approved) {
      return commandFailureFrom("CONTENT_PAGE_APPROVE_FAILED", "Failed to approve page.");
    }

    const correlationId = inputCorrelationId ?? generateId();

    await new PublishDomainEventUseCase(this.eventStore, this.eventBus).execute({
      id: generateId(),
      eventName: "content.page_approved",
      aggregateType: "ContentPage",
      aggregateId: pageId,
      payload: {
        pageId,
        accountId,
        workspaceId: workspaceId ?? page.workspaceId,
        extractedTasks,
        extractedInvoices,
        actorId,
        causationId: inputCausationId,
        correlationId,
      },
      metadata: { actorId, causationId, correlationId, workspaceId: workspaceId ?? page.workspaceId },
    });

    return commandSuccess(pageId, Date.now());
  }
}
