/**
 * PlatformEventIngressPort — Input Port Interface
 *
 * The driving port for ingesting external domain events into the platform module.
 * Implemented by: events/routing/routeIngressEvent.ts
 * Called by:      QStash webhook route handler, test harnesses
 *
 * Contract:
 *   ingestEvent(event: PlatformDomainEvent): Promise<void>
 *
 * Invariants:
 *   - Ingestion is idempotent by eventId; re-processing the same event must be safe
 *   - The port itself does not validate payloads; events/ingress/ validates before calling
 *   - The port returns void; failures are expressed via thrown typed errors
 *
 * @see ports/input/index.ts — re-exports this interface
 * @see events/routing/routeIngressEvent.ts — implementation
 * @see docs/bounded-context.md — port contract rules
 */

// TODO: implement / re-export PlatformEventIngressPort interface
