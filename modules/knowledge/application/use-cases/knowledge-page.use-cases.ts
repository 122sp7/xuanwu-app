/**
 * Module: knowledge
 * Layer: application/use-cases
 * Purpose: Page use cases — create, rename, move, reorder blocks, archive, list.
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";

import type { KnowledgePage, KnowledgePageTreeNode } from "../../domain/entities/content-page.entity";
import type { KnowledgePageRepository } from "../../domain/repositories/knowledge.repositories";
import {
  PublishDomainEventUseCase,
  type IEventStoreRepository,
  type IEventBusRepository,
} from "@/modules/shared/api";
import { v7 as generateId } from "@lib-uuid";
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
  ApproveKnowledgePageSchema,
  type ApproveKnowledgePageDto,
  VerifyKnowledgePageSchema,
  type VerifyKnowledgePageDto,
  RequestPageReviewSchema,
  type RequestPageReviewDto,
  AssignPageOwnerSchema,
  type AssignPageOwnerDto,
} from "../dto/knowledge.dto";

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

  const sortByOrder = (nodes: KnowledgePageTreeNode[]): void => {
    nodes.sort((a, b) => a.order - b.order);
    for (const n of nodes) sortByOrder(n.children as KnowledgePageTreeNode[]);
  };
  sortByOrder(roots);

  return roots;
}

export class CreateKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: CreateKnowledgePageDto): Promise<CommandResult> {
    const parsed = CreateKnowledgePageSchema.safeParse(input);
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

export class RenameKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: RenameKnowledgePageDto): Promise<CommandResult> {
    const parsed = RenameKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, title } = parsed.data;
    const updated = await this.repo.rename({ accountId, pageId, title: title.trim() });
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class MoveKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: MoveKnowledgePageDto): Promise<CommandResult> {
    const parsed = MoveKnowledgePageSchema.safeParse(input);
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

export class ArchiveKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: ArchiveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ArchiveKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId } = parsed.data;
    const updated = await this.repo.archive(accountId, pageId);
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ReorderKnowledgePageBlocksUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: ReorderKnowledgePageBlocksDto): Promise<CommandResult> {
    const parsed = ReorderKnowledgePageBlocksSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, blockIds } = parsed.data;
    const updated = await this.repo.reorderBlocks({ accountId, pageId, blockIds });
    if (!updated) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
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

export class ApproveKnowledgePageUseCase {
  constructor(
    private readonly repo: KnowledgePageRepository,
    private readonly eventStore: IEventStoreRepository,
    private readonly eventBus: IEventBusRepository,
  ) {}

  async execute(input: ApproveKnowledgePageDto): Promise<CommandResult> {
    const parsed = ApproveKnowledgePageSchema.safeParse(input);
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
      eventName: "knowledge.page_approved",
      aggregateType: "KnowledgePage",
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

export class VerifyKnowledgePageUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: VerifyKnowledgePageDto): Promise<CommandResult> {
    const parsed = VerifyKnowledgePageSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, verifiedByUserId, verificationExpiresAtISO } = parsed.data;
    const result = await this.repo.verify({ accountId, pageId, verifiedByUserId, verificationExpiresAtISO });
    if (!result) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class RequestPageReviewUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: RequestPageReviewDto): Promise<CommandResult> {
    const parsed = RequestPageReviewSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, requestedByUserId } = parsed.data;
    const result = await this.repo.requestReview({ accountId, pageId, requestedByUserId });
    if (!result) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(result.id, Date.now());
  }
}

export class AssignPageOwnerUseCase {
  constructor(private readonly repo: KnowledgePageRepository) {}

  async execute(input: AssignPageOwnerDto): Promise<CommandResult> {
    const parsed = AssignPageOwnerSchema.safeParse(input);
    if (!parsed.success) {
      return commandFailureFrom("CONTENT_PAGE_INVALID_INPUT", parsed.error.message);
    }

    const { accountId, pageId, ownerId } = parsed.data;
    const result = await this.repo.assignOwner({ accountId, pageId, ownerId });
    if (!result) return commandFailureFrom("CONTENT_PAGE_NOT_FOUND", "Page not found.");
    return commandSuccess(result.id, Date.now());
  }
}
