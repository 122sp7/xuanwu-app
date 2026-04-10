/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: ContentBlock domain events.
 */

import type { NotionDomainEvent } from "./NotionDomainEvent";

export interface BlockAddedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
}

export interface BlockAddedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block_added";
  readonly payload: BlockAddedPayload;
}

export interface BlockUpdatedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
  readonly contentText: string;
}

export interface BlockUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block_updated";
  readonly payload: BlockUpdatedPayload;
}

export interface BlockDeletedPayload {
  readonly blockId: string;
  readonly pageId: string;
  readonly accountId: string;
}

export interface BlockDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.block_deleted";
  readonly payload: BlockDeletedPayload;
}

export type KnowledgeBlockDomainEvent =
  | BlockAddedEvent
  | BlockUpdatedEvent
  | BlockDeletedEvent;
