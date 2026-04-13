/**
 * SearchQueryExecutedEvent
 *
 * Event type: "search.query-executed"
 * Owner:      application layer (search)
 *
 * When emitted:
 *   A search query was completed and produced results.
 *
 * Core payload fields:
 *   queryId, queryText, resultCount
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: SEARCH_QUERY_EXECUTED_EVENT_TYPE
 */

// TODO: implement SearchQueryExecutedEvent payload type and factory function
