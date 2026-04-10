/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/services
 * Purpose: BacklinkExtractorService — domain service that extracts page IDs mentioned in block content.
 */

import type { ContentBlockSnapshot } from "../aggregates/ContentBlock";
import { extractMentionedPageIds } from "../value-objects/BlockContent";

export interface BacklinkMention {
  readonly targetPageId: string;
  readonly blockId: string;
  readonly lastSeenAtISO: string;
}

export class BacklinkExtractorService {
  /**
   * Extract all page mentions from a list of block snapshots.
   * Returns a map of targetPageId -> list of mentions.
   */
  extractMentions(
    blocks: ReadonlyArray<ContentBlockSnapshot>,
  ): ReadonlyMap<string, ReadonlyArray<{ blockId: string; lastSeenAtISO: string }>> {
    const result = new Map<string, Array<{ blockId: string; lastSeenAtISO: string }>>();
    const now = new Date().toISOString();

    for (const block of blocks) {
      const pageIds = extractMentionedPageIds(block.content.richText);
      for (const pageId of pageIds) {
        if (!result.has(pageId)) {
          result.set(pageId, []);
        }
        result.get(pageId)!.push({ blockId: block.id, lastSeenAtISO: now });
      }
    }

    return result;
  }
}
