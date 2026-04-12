/**
 * Module: notion/subdomains/database
 * Layer: domain/events
 * Purpose: Domain events for database operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface DatabaseCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.database_created";
  readonly payload: {
    readonly databaseId: string;
    readonly accountId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}

export interface DatabaseRenamedEvent extends NotionDomainEvent {
  readonly type: "notion.database.database_renamed";
  readonly payload: {
    readonly databaseId: string;
    readonly previousTitle: string;
    readonly newTitle: string;
    readonly organizationId: string;
  };
}

export interface FieldAddedEvent extends NotionDomainEvent {
  readonly type: "notion.database.field_added";
  readonly payload: {
    readonly databaseId: string;
    readonly fieldId: string;
    readonly fieldName: string;
    readonly fieldType: string;
    readonly organizationId: string;
  };
}

export interface FieldDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.database.field_deleted";
  readonly payload: {
    readonly databaseId: string;
    readonly fieldId: string;
    readonly organizationId: string;
  };
}

export interface RecordAddedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record_added";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}

export interface RecordUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record_updated";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}

export interface RecordDeletedEvent extends NotionDomainEvent {
  readonly type: "notion.database.record_deleted";
  readonly payload: {
    readonly databaseId: string;
    readonly recordId: string;
    readonly organizationId: string;
  };
}

export interface ViewCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.view_created";
  readonly payload: {
    readonly databaseId: string;
    readonly viewId: string;
    readonly viewType: string;
    readonly organizationId: string;
  };
}

export interface ViewUpdatedEvent extends NotionDomainEvent {
  readonly type: "notion.database.view_updated";
  readonly payload: {
    readonly databaseId: string;
    readonly viewId: string;
    readonly organizationId: string;
  };
}
