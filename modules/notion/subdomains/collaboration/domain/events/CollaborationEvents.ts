/**
 * Module: notion/subdomains/collaboration
 * Layer: domain/events
 * Purpose: Domain events for collaboration operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface CommentCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.comment-created";
  readonly payload: {
    readonly commentId: string;
    readonly pageId: string;
    readonly authorId: string;
    readonly organizationId: string;
  };
}

export interface CommentResolvedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.comment-resolved";
  readonly payload: {
    readonly commentId: string;
    readonly resolvedById: string;
    readonly organizationId: string;
  };
}

export interface PermissionGrantedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.permission-granted";
  readonly payload: {
    readonly permissionId: string;
    readonly resourceId: string;
    readonly granteeId: string;
    readonly level: string;
    readonly organizationId: string;
  };
}

export interface PermissionRevokedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.permission-revoked";
  readonly payload: {
    readonly permissionId: string;
    readonly resourceId: string;
    readonly granteeId: string;
    readonly organizationId: string;
  };
}

export interface VersionCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.version-created";
  readonly payload: {
    readonly versionId: string;
    readonly pageId: string;
    readonly authorId: string;
    readonly versionNumber: number;
    readonly organizationId: string;
  };
}

export interface VersionRestoredEvent extends NotionDomainEvent {
  readonly type: "notion.collaboration.version-restored";
  readonly payload: {
    readonly versionId: string;
    readonly pageId: string;
    readonly restoredById: string;
    readonly organizationId: string;
  };
}
