/**
 * modules/shared — domain event: KnowledgePageCreatedEvent
 *
 * Fired by the content module whenever a new page is created.
 * The knowledge-graph module subscribes to this event to automatically
 * register a GraphNode for the new page (auto-link trigger pipeline).
 *
 * Follows Occam's Razor: minimal fields to drive downstream reactions.
 */

import { v7 as generateId } from "@lib-uuid";

import type { DomainEvent } from "../events";

export const KNOWLEDGE_PAGE_CREATED_EVENT_TYPE = "knowledge.page_created" as const;

export interface KnowledgePageCreatedEvent extends DomainEvent {
  readonly type: typeof KNOWLEDGE_PAGE_CREATED_EVENT_TYPE;
  /** ID of the newly created page */
  readonly pageId: string;
  /** Human-readable title of the page */
  readonly title: string;
  /** Account that owns the page */
  readonly accountId: string;
  /** Optional workspace the page belongs to */
  readonly workspaceId?: string;
  /** Optional parent page for hierarchy tracking */
  readonly parentPageId?: string | null;
  /** User who created the page */
  readonly createdByUserId: string;
}

export function createKnowledgePageCreatedEvent(
  pageId: string,
  title: string,
  accountId: string,
  createdByUserId: string,
  options?: { workspaceId?: string; parentPageId?: string | null },
): KnowledgePageCreatedEvent {
  return {
    eventId: generateId(),
    type: KNOWLEDGE_PAGE_CREATED_EVENT_TYPE,
    aggregateId: pageId,
    occurredAt: new Date().toISOString(),
    pageId,
    title,
    accountId,
    createdByUserId,
    workspaceId: options?.workspaceId,
    parentPageId: options?.parentPageId,
  };
}
