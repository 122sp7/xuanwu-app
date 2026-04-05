/**
 * modules/wiki — application/use-cases
 * Purpose: AutoLinkUseCase — reacts to content domain events and maintains
 *          the knowledge graph automatically.
 *
 * Handled events:
 *   - KnowledgePageCreatedEvent  → upserts a GraphNode for the new page;
 *                                creates a "hierarchy" Link when the page
 *                                has a parent.
 *   - KnowledgeUpdatedEvent      → delegates to LinkExtractorService for
 *                                WikiLink (explicit link) extraction.
 *
 * Register on the shared event bus via `registerOn(eventBus)` once during
 * application bootstrap — identical to the pattern used by LinkExtractorService.
 *
 * Architecture note:
 *   This use case ONLY imports from the shared/ module and from its own
 *   knowledge-graph domain layer.  It never imports from content/ internals.
 */

import {
  type KnowledgePageCreatedEvent,
  KNOWLEDGE_PAGE_CREATED_EVENT_TYPE,
  type SimpleEventBus,
} from "../../../shared/api";

import type { GraphRepository } from "../../domain/repositories/GraphRepository";
import { LinkExtractorService } from "../link-extractor.service";

export class AutoLinkUseCase {
  private readonly linkExtractor: LinkExtractorService;

  constructor(private readonly graphRepo: GraphRepository) {
    this.linkExtractor = new LinkExtractorService(graphRepo);
  }

  /**
   * Register all auto-link subscriptions on the provided event bus.
   * Call once during application bootstrap.
   */
  registerOn(eventBus: SimpleEventBus): void {
    // 1. Page creation → upsert GraphNode (+ optional hierarchy Link).
    eventBus.subscribe<KnowledgePageCreatedEvent>(
      KNOWLEDGE_PAGE_CREATED_EVENT_TYPE,
      this.handlePageCreated.bind(this),
    );

    // 2. Block update → WikiLink extraction → explicit Links.
    this.linkExtractor.registerOn(eventBus);
  }

  /**
   * React to a KnowledgePageCreatedEvent:
   * 1. Upsert a GraphNode for the new page.
   * 2. If the page has a parent, create a "hierarchy" Link.
   */
  async handlePageCreated(event: KnowledgePageCreatedEvent): Promise<void> {
    await this.graphRepo.upsertNode({
      id: event.pageId,
      label: event.title,
      type: "page",
    });

    if (event.parentPageId) {
      const linkId = `${event.parentPageId}→${event.pageId}:hierarchy`;
      await this.graphRepo.addLink({
        id: linkId,
        sourceId: event.parentPageId,
        targetId: event.pageId,
        type: "hierarchy",
      });
    }
  }
}
