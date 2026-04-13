/**
 * SupportTicketOpenedEvent
 *
 * Event type: "support.ticket-opened"
 * Owner:      application layer (support)
 *
 * When emitted:
 *   A support ticket was created.
 *
 * Core payload fields:
 *   ticketId, priority, requesterRef
 *
 * Envelope fields (standard for all platform events):
 *   type, aggregateType, aggregateId, contextId,
 *   occurredAt (ISO 8601), version, correlationId, causationId, actorId, payload
 *
 * @see docs/domain-events.md — 發出事件
 * @see domain/events/index.ts — event type constant: SUPPORT_TICKET_OPENED_EVENT_TYPE
 */

// TODO: implement SupportTicketOpenedEvent payload type and factory function
