import { v4 as uuid } from "@lib-uuid";
/**
 * buildCorrelationId — generate a new UUID v4 correlation identifier.
 *
 * Application-level helper used when a new command arrives at the driving
 * adapter without an existing correlation chain, or when starting a new
 * batch of domain events not caused by an existing event.
 *
 * @see shared/types/CorrelationContext.ts
 */
export function buildCorrelationId(): string {
	return uuid();
}
