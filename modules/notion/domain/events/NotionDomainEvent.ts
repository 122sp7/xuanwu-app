/**
 * Module: notion
 * Layer: domain/events (context-wide)
 * Purpose: Base domain event interface for the notion bounded context.
 *          All subdomain events (knowledge, authoring, collaboration, database, etc.)
 *          should extend this interface.
 *
 * NOTE: subdomains/knowledge/domain/events/NotionDomainEvent.ts carries the same shape.
 *       Future convergence should re-export this context-wide version.
 */

export interface NotionDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
