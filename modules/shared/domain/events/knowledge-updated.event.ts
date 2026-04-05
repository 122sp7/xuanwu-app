/**
 * modules/shared — domain event: KnowledgeUpdatedEvent
 *
 * Fired by the content module whenever a block's content changes.
 * Knowledge and AI modules subscribe to this event to react
 * (link extraction, vector re-indexing, etc.).
 *
 * Follows Occam's Razor: minimal fields needed to drive downstream reactions.
 */

import { v7 as generateId } from "@lib-uuid";

import type { DomainEvent } from "../events";

export const KNOWLEDGE_UPDATED_EVENT_TYPE = "knowledge.block-updated" as const;

export interface KnowledgeUpdatedEvent extends DomainEvent {
  readonly type: typeof KNOWLEDGE_UPDATED_EVENT_TYPE;
  /** ID of the page that owns the block */
  readonly pageId: string;
  /** ID of the block that was updated */
  readonly blockId: string;
  /** The new plain-text content of the block */
  readonly content: string;
}

export function createKnowledgeUpdatedEvent(
  pageId: string,
  blockId: string,
  content: string,
): KnowledgeUpdatedEvent {
  return {
    eventId: generateId(),
    type: KNOWLEDGE_UPDATED_EVENT_TYPE,
    aggregateId: blockId,
    occurredAt: new Date().toISOString(),
    pageId,
    blockId,
    content,
  };
}
