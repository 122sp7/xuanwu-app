/**
 * Module: notebooklm
 * Layer: domain/events (context-wide)
 * Purpose: Base domain event interface for the notebooklm bounded context.
 *          All subdomain events should extend this interface.
 */

export interface NotebookLmDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}
