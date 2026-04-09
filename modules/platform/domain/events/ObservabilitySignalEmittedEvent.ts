/**
 * ObservabilitySignalEmittedEvent
 *
 * Event type: "observability.signal_emitted"
 * Owner:      application layer (observability)
 *
 * When emitted:
 *   A metric, trace, or alert signal was emitted.
 *
 * Core payload fields:
 *   signalName, signalLevel, sourceRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: OBSERVABILITY_SIGNAL_EMITTED_EVENT_TYPE
 */

// TODO: implement ObservabilitySignalEmittedEvent payload type and factory function
