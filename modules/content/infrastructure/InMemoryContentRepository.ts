/**
 * Module: content
 * Layer: infrastructure/in-memory
 * Purpose: In-memory adapter for ContentPageRepository and ContentBlockRepository.
 *          Uses plain Map<string, …> — no external database required.
 *          Designed for local demos and unit tests (Occam's Razor).
 */

import { v7 as generateId } from "@lib-uuid";

import type {
  ContentBlock,
  AddContentBlockInput,
  UpdateContentBlockInput,
} from "../domain/entities/content-block.entity";
import type {
  ContentPage,
  CreateContentPageInput,
  RenameContentPageInput,
  MoveContentPageInput,
  ReorderContentPageBlocksInput,
} from "../domain/entities/content-page.entity";
import type {
  ContentBlockRepository,
  ContentPageRepository,
} from "../domain/repositories/content.repositories";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// ─── Page repository ──────────────────────────────────────────────────────────

export class InMemoryContentPageRepository implements ContentPageRepository {
  private readonly pages = new Map<string, ContentPage>();

  async create(input: CreateContentPageInput): Promise<ContentPage> {
    const now = new Date().toISOString();
    const id = generateId();
    const page: ContentPage = {
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

  async rename(input: RenameContentPageInput): Promise<ContentPage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: ContentPage = {
      ...page,
      title: input.title,
      slug: generateSlug(input.title),
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async move(input: MoveContentPageInput): Promise<ContentPage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: ContentPage = {
      ...page,
      parentPageId: input.targetParentPageId,
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async reorderBlocks(input: ReorderContentPageBlocksInput): Promise<ContentPage | null> {
    const page = this.pages.get(input.pageId);
    if (!page) return null;
    const updated: ContentPage = {
      ...page,
      blockIds: [...input.blockIds],
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(input.pageId, updated);
    return updated;
  }

  async archive(_accountId: string, pageId: string): Promise<ContentPage | null> {
    const page = this.pages.get(pageId);
    if (!page) return null;
    const updated: ContentPage = {
      ...page,
      status: "archived",
      updatedAtISO: new Date().toISOString(),
    };
    this.pages.set(pageId, updated);
    return updated;
  }

  async findById(_accountId: string, pageId: string): Promise<ContentPage | null> {
    return this.pages.get(pageId) ?? null;
  }

  async listByAccountId(accountId: string): Promise<ContentPage[]> {
    return [...this.pages.values()].filter((p) => p.accountId === accountId);
  }

  async listByWorkspaceId(accountId: string, workspaceId: string): Promise<ContentPage[]> {
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

export class InMemoryContentBlockRepository implements ContentBlockRepository {
  private readonly blocks = new Map<string, ContentBlock>();

  async add(input: AddContentBlockInput): Promise<ContentBlock> {
    const now = new Date().toISOString();
    const id = generateId();
    const siblingsCount = [...this.blocks.values()].filter(
      (b) => b.pageId === input.pageId && b.accountId === input.accountId,
    ).length;
    const block: ContentBlock = {
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

  async update(input: UpdateContentBlockInput): Promise<ContentBlock | null> {
    const block = this.blocks.get(input.blockId);
    if (!block) return null;
    const updated: ContentBlock = {
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

  async findById(_accountId: string, blockId: string): Promise<ContentBlock | null> {
    return this.blocks.get(blockId) ?? null;
  }

  async listByPageId(accountId: string, pageId: string): Promise<ContentBlock[]> {
    return [...this.blocks.values()]
      .filter((b) => b.accountId === accountId && b.pageId === pageId)
      .sort((a, b) => a.order - b.order);
  }
}
