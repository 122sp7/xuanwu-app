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

  constructor(eventBus: SimpleEventBus) {
    this.pageRepo = new InMemoryContentPageRepository();
    this.blockRepo = new InMemoryContentBlockRepository();
    this.blockService = new BlockService(this.blockRepo, eventBus);
  }

  /** Create a new page in the in-memory store. */
  async createPage(
    accountId: string,
    title: string,
    createdByUserId = "system",
  ): Promise<ContentPage> {
    return this.pageRepo.create({ accountId, title, createdByUserId });
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
}
