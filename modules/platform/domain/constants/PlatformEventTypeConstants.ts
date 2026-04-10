/**
 * PlatformEventTypeConstants — Shared Constants
 *
 * Re-exports all PlatformDomainEventType string constants from domain/events/index.ts
 * as a named constant group for use in adapters and infrastructure layers.
 *
 * Rationale:
 *   Infrastructure and adapter layers need event type string literals for
 *   QStash topic routing, Firestore query filters, and monitoring dashboards.
 *   Using this re-export prevents direct domain layer imports into infrastructure.
 *
 * @see domain/events/index.ts — canonical event type source
 */

// TODO: re-export PLATFORM_DOMAIN_EVENT_TYPES from domain/events/index.ts
