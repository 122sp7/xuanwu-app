/**
 * modules/knowledge-graph — application
 * Purpose: LinkExtractorService — subscribes to ContentUpdatedEvent and
 *          extracts [[WikiLink]] references to build graph edges.
 *
 * Wikilink syntax: [[Target Page Name]]
 *   - The target label becomes both the node id (lowercased slug) and label.
 *   - Links are of type "explicit" (user-authored inline reference).
 */

import {
  type ContentUpdatedEvent,
  CONTENT_UPDATED_EVENT_TYPE,
} from "../../shared/domain/events/content-updated.event";
import type { SimpleEventBus } from "../../shared/infrastructure/SimpleEventBus";

import type { GraphRepository } from "../domain/repositories/GraphRepository";

const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;

function slugify(label: string): string {
  return label.trim().toLowerCase().replace(/\s+/g, "-");
}

export class LinkExtractorService {
  constructor(private readonly graphRepo: GraphRepository) {}

  /**
   * Register this service as a subscriber on the provided event bus.
   * Call once during application bootstrap.
   */
  registerOn(eventBus: SimpleEventBus): void {
    eventBus.subscribe<ContentUpdatedEvent>(
      CONTENT_UPDATED_EVENT_TYPE,
      this.handleContentUpdated.bind(this),
    );
  }

  /**
   * React to a ContentUpdatedEvent:
   * 1. Parse all [[WikiLink]] targets from the new content.
   * 2. Upsert a GraphNode for each target.
   * 3. Create an explicit Link from the source page to each target.
   */
  async handleContentUpdated(event: ContentUpdatedEvent): Promise<void> {
    const targets = this.extractWikiLinks(event.content);

    for (const targetLabel of targets) {
      const targetId = slugify(targetLabel);

      // Ensure the target node exists in the graph.
      await this.graphRepo.upsertNode({
        id: targetId,
        label: targetLabel.trim(),
        type: "page",
      });

      // Create a directed edge from the source page to the target.
      const linkId = `${event.pageId}→${targetId}`;
      await this.graphRepo.addLink({
        id: linkId,
        sourceId: event.pageId,
        targetId,
        type: "explicit",
      });
    }
  }

  /** Extract all [[…]] targets from a content string. */
  extractWikiLinks(content: string): string[] {
    const targets: string[] = [];
    let match: RegExpExecArray | null;
    WIKI_LINK_REGEX.lastIndex = 0;
    while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
      const label = match[1];
      if (label) targets.push(label);
    }
    return targets;
  }
}
