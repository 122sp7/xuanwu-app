/**
 * PolicyCatalogPublishedEvent
 *
 * Event type: "policy.catalog-published"
 * Owner:      PolicyCatalog
 *
 * When emitted:
 *   A new policy revision has taken effect.
 *
 * Core payload fields:
 *   policyCatalogId, revision
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: POLICY_CATALOG_PUBLISHED_EVENT_TYPE
 */

// TODO: implement PolicyCatalogPublishedEvent payload type and factory function
