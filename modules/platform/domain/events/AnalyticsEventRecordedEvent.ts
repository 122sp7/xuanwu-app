/**
 * AnalyticsEventRecordedEvent
 *
 * Event type: "analytics.event_recorded"
 * Owner:      application layer (analytics)
 *
 * When emitted:
 *   An analytics event was recorded and aggregated.
 *
 * Core payload fields:
 *   eventName, metricRef, subjectRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: ANALYTICS_EVENT_RECORDED_EVENT_TYPE
 */

// TODO: implement AnalyticsEventRecordedEvent payload type and factory function
