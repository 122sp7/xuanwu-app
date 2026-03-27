/**
 * Module: content
 * Layer: api (cross-module facade)
 * Purpose: ContentApi — lightweight facade that wires in-memory adapters and
 *          exposes the minimal surface needed by the demo-flow script and by
 *          other modules that communicate through the event bus.
 *
 * This is intentionally separate from ContentFacade (which uses Firebase).
 * ContentApi uses InMemory repos so it can run without any external service.
 */

import {
  createContentPageCreatedEvent,
} from "../../shared/domain/events/content-page-created.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { ContentBlock } from "../domain/entities/content-block.entity";
import type { ContentPage } from "../domain/entities/content-page.entity";
import { BlockService } from "../application/block-service";
import {
  InMemoryContentPageRepository,
  InMemoryContentBlockRepository,
} from "../infrastructure/InMemoryContentRepository";

export class ContentApi {
  private readonly pageRepo: InMemoryContentPageRepository;
  private readonly blockRepo: InMemoryContentBlockRepository;
  private readonly blockService: BlockService;
  private readonly eventBus: SimpleEventBus;

  constructor(eventBus: SimpleEventBus) {
    this.pageRepo = new InMemoryContentPageRepository();
    this.blockRepo = new InMemoryContentBlockRepository();
    this.blockService = new BlockService(this.blockRepo, eventBus);
    this.eventBus = eventBus;
  }

  /**
   * Create a new page in the in-memory store and publish a
   * `ContentPageCreatedEvent` so the knowledge-graph module can
   * automatically register a GraphNode for the new page.
   */
  async createPage(
    accountId: string,
    title: string,
    createdByUserId = "system",
    options?: { workspaceId?: string; parentPageId?: string | null },
  ): Promise<ContentPage> {
    const page = await this.pageRepo.create({
      accountId,
      title,
      createdByUserId,
      parentPageId: options?.parentPageId ?? null,
    });

    const event = createContentPageCreatedEvent(
      page.id,
      page.title,
      accountId,
      createdByUserId,
      { workspaceId: options?.workspaceId, parentPageId: options?.parentPageId },
    );
    await this.eventBus.publish(event);

    return page;
  }

  /** Add a block to an existing page and return the new block. */
  async addBlock(accountId: string, pageId: string, text: string): Promise<ContentBlock> {
    return this.blockRepo.add({
      accountId,
      pageId,
      content: { type: "text", text },
    });
  }

  /**
   * Update a block's text content.
   * Publishes `ContentUpdatedEvent` via the event bus so downstream modules
   * (e.g. knowledge) can react.
   */
  async updateBlock(
    accountId: string,
    blockId: string,
    text: string,
  ): Promise<ContentBlock | null> {
    return this.blockService.updateBlock({ accountId, blockId, text });
  }

  /** Return all pages for an account. */
  async listPages(accountId: string): Promise<ContentPage[]> {
    return this.pageRepo.listByAccountId(accountId);
  }

  /** Return the page with all its blocks (flat list, ordered). */
  async getPageStructure(
    accountId: string,
    pageId: string,
  ): Promise<{ page: ContentPage; blocks: ContentBlock[] } | null> {
    const page = await this.pageRepo.findById(accountId, pageId);
    if (!page) return null;
    const blocks = await this.blockRepo.listByPageId(accountId, pageId);
    return { page, blocks };
  }
}

