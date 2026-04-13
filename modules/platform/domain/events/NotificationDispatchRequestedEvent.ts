/**
 * NotificationDispatchRequestedEvent
 *
 * Event type: "notification.dispatch-requested"
 * Owner:      application layer (notification)
 *
 * When emitted:
 *   A notification dispatch request was created.
 *
 * Core payload fields:
 *   channel, recipientRef, templateKey
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: NOTIFICATION_DISPATCH_REQUESTED_EVENT_TYPE
 */

// TODO: implement NotificationDispatchRequestedEvent payload type and factory function
