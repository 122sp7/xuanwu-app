/**
 * AuditSignalRecordedEvent
 *
 * Event type: "audit.signal_recorded"
 * Owner:      application layer (audit-log)
 *
 * When emitted:
 *   An immutable audit signal was written.
 *
 * Core payload fields:
 *   signalType, severity, subjectRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: AUDIT_SIGNAL_RECORDED_EVENT_TYPE
 */

// TODO: implement AuditSignalRecordedEvent payload type and factory function
