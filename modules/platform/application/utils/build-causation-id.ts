/**
 * buildCausationId — derive a causation identifier from a triggering event or command.
 *
 * The causation ID links each domain event back to the event or command that
 * triggered it, forming an observable causal chain.
 *
 * Convention:
 *   commandCausation — pass the commandId from the triggering PlatformCommand.
 *   eventCausation   — pass the eventId from the triggering PlatformDomainEvent.
 *
 * @see shared/types/CorrelationContext.ts
 */
export function buildCausationId(triggeringId: string): string {
	return `caused-by:${triggeringId}`;
}
