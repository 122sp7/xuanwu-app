/**
 * buildCorrelationId — generate a new UUID v4 correlation identifier.
 *
 * Used when:
 *   - A new command arrives at the driving adapter without an existing
 *     correlation chain.
 *   - Starting a new batch of domain events not caused by an existing event.
 *
 * @see shared/types/CorrelationContext.ts
 */
export function buildCorrelationId(): string {
	return crypto.randomUUID();
}
