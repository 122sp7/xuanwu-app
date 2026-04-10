/**
 * Module: notion/subdomains/knowledge
 * Layer: domain/events
 * Purpose: Base interface for Notion Knowledge domain events.
 */

export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO 8601 string
  readonly type: string;
  readonly payload: object;
}
