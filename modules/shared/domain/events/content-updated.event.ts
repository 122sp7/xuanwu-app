/**
 * modules/shared — domain event: ContentUpdatedEvent
 *
 * Fired by the content module whenever a block's content changes.
 * Knowledge and AI modules subscribe to this event to react
 * (link extraction, vector re-indexing, etc.).
 *
 * Follows Occam's Razor: minimal fields needed to drive downstream reactions.
 */

import { v7 as generateId } from "@lib-uuid";

import type { DomainEvent } from "../events";

export const CONTENT_UPDATED_EVENT_TYPE = "content.block-updated" as const;

export interface ContentUpdatedEvent extends DomainEvent {
  readonly type: typeof CONTENT_UPDATED_EVENT_TYPE;
  /** ID of the page that owns the block */
  readonly pageId: string;
  /** ID of the block that was updated */
  readonly blockId: string;
  /** The new plain-text content of the block */
  readonly content: string;
}

export function createContentUpdatedEvent(
  pageId: string,
  blockId: string,
  content: string,
): ContentUpdatedEvent {
  return {
    eventId: generateId(),
    type: CONTENT_UPDATED_EVENT_TYPE,
    aggregateId: blockId,
    occurredAt: new Date().toISOString(),
    pageId,
    blockId,
    content,
  };
}
