/**
 * PermissionDecisionRecordedEvent
 *
 * Event type: "permission.decision_recorded"
 * Owner:      application layer (permission service)
 *
 * When emitted:
 *   A traceable authorization decision was completed.
 *
 * Core payload fields:
 *   decision, subjectRef, resourceRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: PERMISSION_DECISION_RECORDED_EVENT_TYPE
 */

// TODO: implement PermissionDecisionRecordedEvent payload type and factory function
