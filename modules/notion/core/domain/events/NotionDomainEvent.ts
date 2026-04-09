/**
 * Module: notion/core
 * Layer: domain/events
 * Purpose: Base interface for all Notion domain events.
 */

export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string; // ISO 8601 string
  readonly type: string;
  readonly payload: Record<string, unknown>;
}
