/**
 * Module: knowledge
 * Layer: api (cross-module facade)
 * Purpose: KnowledgeApi — lightweight facade that wires in-memory adapters and
 *          exposes the minimal surface needed by the demo-flow script and by
 *          other modules that communicate through the event bus.
 *
 * This is intentionally separate from KnowledgeFacade (which uses Firebase).
 * KnowledgeApi uses InMemory repos so it can run without any external service.
 */

import {
  createKnowledgePageCreatedEvent,
} from "../../shared/domain/events/knowledge-page-created.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { KnowledgeBlock } from "../domain/entities/content-block.entity";
import type { KnowledgePage } from "../domain/entities/knowledge-page.entity";
import { BlockService } from "../application/block-service";
import {
  InMemoryKnowledgePageRepository,
  InMemoryKnowledgeBlockRepository,
} from "../infrastructure/InMemoryKnowledgeRepository";

export class KnowledgeApi {
  private readonly pageRepo: InMemoryKnowledgePageRepository;
  private readonly blockRepo: InMemoryKnowledgeBlockRepository;
  private readonly blockService: BlockService;
  private readonly eventBus: SimpleEventBus;

  constructor(eventBus: SimpleEventBus) {
    this.pageRepo = new InMemoryKnowledgePageRepository();
    this.blockRepo = new InMemoryKnowledgeBlockRepository();
    this.blockService = new BlockService(this.blockRepo, eventBus);
    this.eventBus = eventBus;
  }

  /**
   * Create a new page in the in-memory store and publish a
    * `KnowledgePageCreatedEvent` so downstream modules can register
    * page-related projections or structure-aware read models.
   */
  async createPage(
    accountId: string,
    title: string,
    createdByUserId = "system",
    options?: { workspaceId?: string; parentPageId?: string | null },
  ): Promise<KnowledgePage> {
    const page = await this.pageRepo.create({
      accountId,
      title,
      createdByUserId,
      parentPageId: options?.parentPageId ?? null,
    });

    const event = createKnowledgePageCreatedEvent(
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
  async addBlock(accountId: string, pageId: string, text: string): Promise<KnowledgeBlock> {
    return this.blockRepo.add({
      accountId,
      pageId,
      content: { type: "text", richText: [{ type: "text", plainText: text }] },
    });
  }

  /**
   * Update a block's text content.
   * Publishes `KnowledgeUpdatedEvent` via the event bus so downstream modules
    * (e.g. search or notebook-adjacent ingestion flows) can react.
   */
  async updateBlock(
    accountId: string,
    blockId: string,
    text: string,
  ): Promise<KnowledgeBlock | null> {
    return this.blockService.updateBlock({ accountId, blockId, text });
  }

  /** Return all pages for an account. */
  async listPages(accountId: string): Promise<KnowledgePage[]> {
    return this.pageRepo.listByAccountId(accountId);
  }

  /** Return the page with all its blocks (flat list, ordered). */
  async getPageStructure(
    accountId: string,
    pageId: string,
  ): Promise<{ page: KnowledgePage; blocks: KnowledgeBlock[] } | null> {
    const page = await this.pageRepo.findById(accountId, pageId);
    if (!page) return null;
    const blocks = await this.blockRepo.listByPageId(accountId, pageId);
    return { page, blocks };
  }
}

