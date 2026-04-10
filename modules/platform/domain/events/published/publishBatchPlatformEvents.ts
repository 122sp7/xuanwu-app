/**
 * publishBatchPlatformEvents — Batch Event Publisher Utility
 *
 * Publishes multiple platform domain events in a single DomainEventPublisher call.
 * Used when a command produces more than one domain event (e.g., capability enable + config applied).
 *
 * Rules:
 *   - Maps each event through buildPublishedEventEnvelope before dispatch
 *   - Preserves event order (emitted in the same order they were collected from the aggregate)
 *   - Must not publish a partial batch on failure; the caller decides retry strategy
 *
 * @see events/published/buildPublishedEventEnvelope.ts
 * @see ports/output/index.ts — DomainEventPublisher
 */

// TODO: implement publishBatchPlatformEvents utility function
