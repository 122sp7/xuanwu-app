/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: KnowledgeCollection domain events.
 */

import type { NotionDomainEvent } from "../../../../core/domain/events/NotionDomainEvent";

export interface CollectionCreatedPayload {
  readonly collectionId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly name: string;
  readonly createdByUserId: string;
}

export interface CollectionCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection_created";
  readonly payload: CollectionCreatedPayload;
}

export interface CollectionRenamedPayload {
  readonly collectionId: string;
  readonly accountId: string;
  readonly previousName: string;
  readonly newName: string;
}

export interface CollectionRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection_renamed";
  readonly payload: CollectionRenamedPayload;
}

export interface CollectionArchivedPayload {
  readonly collectionId: string;
  readonly accountId: string;
}

export interface CollectionArchivedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.collection_archived";
  readonly payload: CollectionArchivedPayload;
}

export type KnowledgeCollectionDomainEvent =
  | CollectionCreatedEvent
  | CollectionRenamedEvent
  | CollectionArchivedEvent;
