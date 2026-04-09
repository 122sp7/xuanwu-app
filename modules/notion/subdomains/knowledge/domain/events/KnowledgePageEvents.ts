/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: KnowledgePage domain events.
 */

import type { NotionDomainEvent } from "../../../../core/domain/events/NotionDomainEvent";

export interface PageCreatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly title: string;
  readonly createdByUserId: string;
}

export interface PageCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_created";
  readonly payload: PageCreatedPayload;
}

export interface PageRenamedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly previousTitle: string;
  readonly newTitle: string;
}

export interface PageRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_renamed";
  readonly payload: PageRenamedPayload;
}

export interface PageMovedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly previousParentPageId: string | null;
  readonly newParentPageId: string | null;
}

export interface PageMovedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_moved";
  readonly payload: PageMovedPayload;
}

export interface PageArchivedPayload {
  readonly pageId: string;
  readonly accountId: string;
}

export interface PageArchivedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_archived";
  readonly payload: PageArchivedPayload;
}

export interface ExtractedTask {
  readonly title: string;
  readonly dueDate?: string;
  readonly description?: string;
}

export interface ExtractedInvoice {
  readonly amount: number;
  readonly description: string;
  readonly currency?: string;
}

export interface PageApprovedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly workspaceId?: string;
  readonly extractedTasks: ReadonlyArray<ExtractedTask>;
  readonly extractedInvoices: ReadonlyArray<ExtractedInvoice>;
  readonly actorId: string;
  readonly causationId: string;
  readonly correlationId: string;
}

export interface PageApprovedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_approved";
  readonly payload: PageApprovedPayload;
}

export interface PageVerifiedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly verifiedByUserId: string;
  readonly verificationExpiresAtISO?: string;
}

export interface PageVerifiedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_verified";
  readonly payload: PageVerifiedPayload;
}

export interface PageReviewRequestedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly requestedByUserId: string;
}

export interface PageReviewRequestedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_review_requested";
  readonly payload: PageReviewRequestedPayload;
}

export interface PageOwnerAssignedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly ownerId: string;
}

export interface PageOwnerAssignedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_owner_assigned";
  readonly payload: PageOwnerAssignedPayload;
}

export interface PageIconUpdatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly iconUrl: string;
}

export interface PageIconUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_icon_updated";
  readonly payload: PageIconUpdatedPayload;
}

export interface PageCoverUpdatedPayload {
  readonly pageId: string;
  readonly accountId: string;
  readonly coverUrl: string;
}

export interface PageCoverUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.knowledge.page_cover_updated";
  readonly payload: PageCoverUpdatedPayload;
}

export type KnowledgePageDomainEvent =
  | PageCreatedEvent
  | PageRenamedEvent
  | PageMovedEvent
  | PageArchivedEvent
  | PageApprovedEvent
  | PageVerifiedEvent
  | PageReviewRequestedEvent
  | PageOwnerAssignedEvent
  | PageIconUpdatedEvent
  | PageCoverUpdatedEvent;
