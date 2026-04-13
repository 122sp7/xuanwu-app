/**
 * Module: notion/subdomains/taxonomy
 * Layer: domain/events
 * Purpose: Domain events for taxonomy operations.
 */

import type { NotionDomainEvent } from "../../../../domain/events/NotionDomainEvent";

export interface TaxonomyNodeCreatedEvent extends NotionDomainEvent {
  readonly type: "notion.taxonomy.node-created";
  readonly payload: {
    readonly nodeId: string;
    readonly label: string;
    readonly parentNodeId: string | null;
    readonly organizationId: string;
  };
}

export interface TaxonomyNodeRemovedEvent extends NotionDomainEvent {
  readonly type: "notion.taxonomy.node-removed";
  readonly payload: {
    readonly nodeId: string;
    readonly organizationId: string;
  };
}
