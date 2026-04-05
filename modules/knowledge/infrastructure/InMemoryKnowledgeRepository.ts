/**
 * Module: knowledge
 * Layer: infrastructure/in-memory
 * Purpose: In-memory adapter for KnowledgePageRepository and KnowledgeBlockRepository.
 *          Uses plain Map<string, …> — no external database required.
 *          Designed for local demos and unit tests (Occam's Razor).
 */

import { v7 as generateId } from "@lib-uuid";

import type {
  KnowledgeBlock,
  AddKnowledgeBlockInput,
  UpdateKnowledgeBlockInput,
} from "../domain/entities/content-block.entity";
import type {
  KnowledgePage,
  CreateKnowledgePageInput,
  RenameKnowledgePageInput,
  MoveKnowledgePageInput,
  ReorderKnowledgePageBlocksInput,
  ApproveKnowledgePageInput,
  VerifyKnowledgePageInput,
  RequestPageReviewInput,
  AssignPageOwnerInput,
} from "../domain/entities/content-page.entity";
import type {
  KnowledgeBlockRepository,
  KnowledgePageRepository,
} from "../domain/repositories/knowledge.repositories";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─── Page repository ──────────────────────────────────────────────────────────

export class InMemoryKnowledgePageRepository implements KnowledgePageRepository {
  private readonly pages = new Map<string, KnowledgePage>();

  async create(input: CreateKnowledgePageInput): Promise<KnowledgePage> {
    const now = new Date().toISOString();
    const id = generateId();
    const page: KnowledgePage = {
      id,
      accountId: input.accountId,
      workspaceId: input.workspaceId,
      title: input.title,
      slug: generateSlug(input.title),
      parentPageId: input.parentPageId ?? null,
      order: this.pages.size,
      blockIds: [],
      status: "active",
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    this.pages.set(id, page);
    return page;
  }

  async rename(input: RenameKnowledgePageInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: KnowledgePage = {
      ...page,
      title: input.title,
      slug: generateSlug(input.title),
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async move(input: MoveKnowledgePageInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: KnowledgePage = {
      ...page,
      parentPageId: input.targetParentPageId,
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async reorderBlocks(input: ReorderKnowledgePageBlocksInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: KnowledgePage = {
      ...page,
      blockIds: [...input.blockIds],
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async archive(_accountId: string, pageId: string): Promise<KnowledgePage | null> {
    const page = this.pages.get(pageId);
    if (!page) return null;
    const updated: KnowledgePage = {
      ...page,
      status: "archived",
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(pageId, updated);
    return updated;
  }

  async approve(input: ApproveKnowledgePageInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    if (page.status === "archived") return null;
    const updated: KnowledgePage = {
      ...page,
      approvalState: "approved",
      approvedAtISO: input.approvedAtISO,
      approvedByUserId: input.approvedByUserId,
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async verify(input: VerifyKnowledgePageInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: KnowledgePage = { ...page, verificationState: "verified", updatedAtISO: new Date().toISOString() };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async requestReview(input: RequestPageReviewInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: KnowledgePage = { ...page, verificationState: "needs_review", updatedAtISO: new Date().toISOString() };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async assignOwner(input: AssignPageOwnerInput): Promise<KnowledgePage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: KnowledgePage = { ...page, ownerId: input.ownerId, updatedAtISO: new Date().toISOString() };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async findById(_accountId: string, pageId: string): Promise<KnowledgePage | null> {
    return this.pages.get(pageId) ?? null;
  }

  async listByAccountId(accountId: string): Promise<KnowledgePage[]> {
    return [...this.pages.values()].filter((p) => p.accountId === accountId);
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<KnowledgePage[]> {
    return [...this.pages.values()].filter(
      (p) => p.accountId === accountId && p.workspaceId === workspaceId,
    );
  }

  /** Append a blockId to a page's blockIds list (called by block operations). */
  async appendBlockId(pageId: string, blockId: string): Promise<void> {
    const page = this.pages.get(pageId);
    if (!page) return;
    this.pages.set(pageId, {
      ...page,
      blockIds: [...page.blockIds, blockId],
      updatedAtISO: new Date().toISOString(),
    });
  }
}

// ─── Block repository ─────────────────────────────────────────────────────────

export class InMemoryKnowledgeBlockRepository implements KnowledgeBlockRepository {
  private readonly blocks = new Map<string, KnowledgeBlock>();

  async add(input: AddKnowledgeBlockInput): Promise<KnowledgeBlock> {
    const now = new Date().toISOString();
    const id = generateId();
    const siblingsCount = [...this.blocks.values()].filter(
      (b) => b.pageId === input.pageId && b.accountId === input.accountId,
    ).length;
    const block: KnowledgeBlock = {
      id,
      pageId: input.pageId,
      accountId: input.accountId,
      content: input.content,
      order: input.index ?? siblingsCount,
      createdAtISO: now,
      updatedAtISO: now,
    };
    this.blocks.set(id, block);
    return block;
  }

  async update(input: UpdateKnowledgeBlockInput): Promise<KnowledgeBlock | null> {
    const block = this.blocks.get(input.blockId);
    if (!block) return null;
    const updated: KnowledgeBlock = {
      ...block,
      content: input.content,
      updatedAtISO: new Date().toISOString(),
    };
    this.blocks.set(input.blockId, updated);
    return updated;
  }

  async delete(_accountId: string, blockId: string): Promise<void> {
    this.blocks.delete(blockId);
  }

  async findById(_accountId: string, blockId: string): Promise<KnowledgeBlock | null> {
    return this.blocks.get(blockId) ?? null;
  }

  async listByPageId(accountId: string, pageId: string): Promise<KnowledgeBlock[]> {
    return [...this.blocks.values()]
      .filter((b) => b.accountId === accountId && b.pageId === pageId)
      .sort((a, b) => a.order - b.order);
  }
}
