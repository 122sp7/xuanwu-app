/**
 * Module: notion/subdomains/relations
 * Layer: domain/events
 * Purpose: Domain events for relation operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface RelationCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.relations.relation_created";
  readonly payload: {
    readonly relationId: string;
    readonly sourceArtifactId: string;
    readonly targetArtifactId: string;
    readonly relationType: string;
    readonly organizationId: string;
  };
}

export interface RelationRemovedEvent extends NotionDomainEvent {
  readonly type: "notion.relations.relation_removed";
  readonly payload: {
    readonly relationId: string;
    readonly organizationId: string;
  };
}
